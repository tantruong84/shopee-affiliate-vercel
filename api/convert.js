import { validateShopeeUrl } from "../lib/validate-url.js";

const json = (res, status, body) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(body);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, {
      error: "METHOD_NOT_ALLOWED",
      message: "Chỉ hỗ trợ POST."
    });
  }

  const contentType = req.headers["content-type"] || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json(res, 415, {
      error: "UNSUPPORTED_MEDIA_TYPE",
      message: "Yêu cầu phải có Content-Type: application/json."
    });
  }

  // Basic body-size guard. Configure platform-level limits/rate limiting too.
  const rawLength = Number(req.headers["content-length"] || 0);
  if (rawLength > 4096) {
    return json(res, 413, {
      error: "PAYLOAD_TOO_LARGE",
      message: "Dữ liệu gửi lên quá lớn."
    });
  }

  const validation = validateShopeeUrl(req.body?.url);
  if (!validation.ok) {
    return json(res, 400, {
      error: "INVALID_URL",
      message: validation.message
    });
  }

  // Fail closed until the account's official API access and signing format
  // have been verified against the current Shopee Affiliate documentation.
  if (process.env.SHOPEE_API_ENABLED !== "true") {
    return json(res, 503, {
      error: "API_NOT_CONFIGURED",
      message: "Website chưa được kết nối Shopee Affiliate Open API. Chưa có link Affiliate nào được tạo."
    });
  }

  // Deliberately do not guess API signing/authentication or endpoint details.
  // Implement the call only after the account-specific official API docs
  // and credentials have been confirmed.
  return json(res, 503, {
    error: "API_ADAPTER_REQUIRED",
    message: "API đã được bật nhưng phần tích hợp chưa được cấu hình. Hãy xác minh endpoint, chữ ký và quyền API trước khi công khai."
  });
}
