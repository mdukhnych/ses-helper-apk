import type {
  BaseServiceItem,
  GoodsAndServicesItem,
  PhoneServicesData,
  PhoneServiceItem,
} from '@/types/services';

const A4_WIDTH = 595;
const A4_HEIGHT = 842;
const CSS_TO_PDF_SCALE = 96 / 72;
const HTML_PAGE_WIDTH = Math.round(A4_WIDTH * CSS_TO_PDF_SCALE);
const HTML_PAGE_HEIGHT = Math.round(A4_HEIGHT * CSS_TO_PDF_SCALE);

const byOrder = <T extends BaseServiceItem>(a: T, b: T) => {
  const orderA = a.order ?? Infinity;
  const orderB = b.order ?? Infinity;

  if (orderA !== orderB) return orderA - orderB;
  return a.id.localeCompare(b.id);
};

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatPrice = (price: number) => {
  const normalizedPrice = Number.isFinite(Number(price)) ? Number(price) : 0;

  return normalizedPrice === 0
    ? '0,00 грн'
    : `${normalizedPrice.toLocaleString('uk-UA')},00 грн`;
};

const getGoodsAndServices = (data: PhoneServicesData) => {
  if (data.goodsAndServices.length > 0) {
    return [...data.goodsAndServices].sort(byOrder);
  }

  const servicesMap = new Map<string, GoodsAndServicesItem>();

  data.servicesItems.forEach(packageItem => {
    packageItem.items.forEach(item => {
      if (!servicesMap.has(item.id)) {
        servicesMap.set(item.id, item);
      }
    });
  });

  return [...servicesMap.values()].sort(byOrder);
};

const renderCheckIcon = () => `
  <svg class="check-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="none" stroke="#16a34a" stroke-width="2.5" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
    <path fill="none" stroke="#16a34a" stroke-width="2.5" d="M8 12l3 3 5-6"></path>
  </svg>
`;

const renderHeaderCells = (packages: PhoneServiceItem[]) =>
  packages
    .map(
      packageItem => `
        <th class="value-cell column-header">
          ${escapeHtml(packageItem.title)}
        </th>
      `
    )
    .join('');

const renderServiceRows = (
  goodsAndServices: GoodsAndServicesItem[],
  packages: PhoneServiceItem[]
) =>
  goodsAndServices
    .map(
      service => `
        <tr>
          <td class="name-cell row-title">${escapeHtml(service.title)}</td>
          ${packages
            .map(packageItem => {
              const isIncluded = packageItem.items.some(
                item => item.id === service.id
              );

              return `
                <td class="value-cell">
                  ${isIncluded ? renderCheckIcon() : '<span class="dash">&mdash;</span>'}
                </td>
              `;
            })
            .join('')}
        </tr>
      `
    )
    .join('');

const renderFooterCells = (packages: PhoneServiceItem[]) =>
  packages
    .map(
      packageItem => `
        <td class="value-cell price-text">
          ${escapeHtml(formatPrice(packageItem.price))}
        </td>
      `
    )
    .join('');

export const buildPhoneServicesPdfHtml = (data: PhoneServicesData) => {
  const goodsAndServices = getGoodsAndServices(data);
  const packages = [...data.servicesItems].sort(byOrder);
  const totalColumnFlex = 5.5 + packages.length * 1.2;
  const nameColumnWidth = `${(5.5 / totalColumnFlex) * 100}%`;
  const packageColumnWidth = `${(1.2 / totalColumnFlex) * 100}%`;

  return `
    <!doctype html>
    <html lang="uk">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          @page {
            size: ${HTML_PAGE_WIDTH}px ${HTML_PAGE_HEIGHT}px;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            color: #111827;
            font-family: Roboto, Arial, sans-serif;
          }

          .page {
            width: ${HTML_PAGE_WIDTH}px;
            min-height: ${HTML_PAGE_HEIGHT}px;
            padding: 20px;
            background: #ffffff;
          }

          .header {
            margin-bottom: 16px;
            padding-bottom: 6px;
            border-bottom: 1px solid #000000;
            text-align: center;
          }

          .header-title {
            margin: 0;
            color: #000000;
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
          }

          table {
            width: 100%;
            border: 1px solid #e5e7eb;
            border-collapse: separate;
            border-spacing: 0;
            border-radius: 6px;
            overflow: hidden;
            table-layout: fixed;
          }

          col.name-column {
            width: ${nameColumnWidth};
          }

          col.value-column {
            width: ${packageColumnWidth};
          }

          th,
          td {
            min-height: 28px;
            padding: 6px 10px;
            border-right: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: middle;
          }

          tr:last-child td {
            border-bottom: 0;
          }

          th:last-child,
          td:last-child {
            border-right: 0;
          }

          thead th,
          tfoot td {
            background: #f3f4f6;
          }

          .name-cell {
            text-align: left;
          }

          .value-cell {
            padding: 6px 4px;
            text-align: center;
          }

          .title-text {
            font-size: 9px;
            font-weight: 700;
          }

          .column-header {
            font-size: 8px;
            font-weight: 700;
            line-height: 1.2;
          }

          .row-title {
            font-size: 8px;
            font-weight: 500;
            line-height: 1.3;
          }

          .footer-title {
            color: #6b7280;
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
          }

          .price-text {
            font-size: 9px;
            font-weight: 700;
          }

          .dash {
            color: #9ca3af;
            font-size: 10px;
            font-weight: 700;
          }

          .check-icon {
            width: 12px;
            height: 12px;
            display: inline-block;
            vertical-align: middle;
          }
        </style>
      </head>
      <body>
        <main class="page">
          <header class="header">
            <h1 class="header-title">Перелік та зміст робіт для послуг налаштувань смартфонів</h1>
          </header>

          <table>
            <colgroup>
              <col class="name-column" />
              ${packages.map(() => '<col class="value-column" />').join('')}
            </colgroup>
            <thead>
              <tr>
                <th class="name-cell title-text">Перелік товарів та робіт</th>
                ${renderHeaderCells(packages)}
              </tr>
            </thead>
            <tbody>
              ${renderServiceRows(goodsAndServices, packages)}
            </tbody>
            <tfoot>
              <tr>
                <td class="name-cell footer-title">Вартість послуг</td>
                ${renderFooterCells(packages)}
              </tr>
            </tfoot>
          </table>
        </main>
      </body>
    </html>
  `;
};

export const generatePhoneServicesPdf = async (data: PhoneServicesData) => {
  const Print = require('expo-print') as typeof import('expo-print');

  const { uri } = await Print.printToFileAsync({
    html: buildPhoneServicesPdfHtml(data),
    width: A4_WIDTH,
    height: A4_HEIGHT,
    base64: false,
  });

  return uri;
};
