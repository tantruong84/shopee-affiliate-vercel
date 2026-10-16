const ALLOWED_HOSTS = new Set([
  "shopee.vn",
  "www.shopee.vn",
  "shope.ee",
  "s.shopee.vn"
]);

export function validateShopeeUrl(value) {
  if (typeof value !== "string" || value.length > 2048) {
    return { ok: false, message: "Link không hợp lệ hoặc quá dài." };
  }

  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    return { ok: false, message: "Vui lòng nhập URL đầy đủ, bắt đầu bằng https://." };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, message: "Chỉ chấp nhận link HTTPS." };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, message: "URL không được chứa thông tin đăng nhập." };
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) {
    return { ok: false, message: "Chỉ chấp nhận tên miền Shopee được hỗ trợ." };
  }

  return { ok: true, url: parsed.toString() };
}
