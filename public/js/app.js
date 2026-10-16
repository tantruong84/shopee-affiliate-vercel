const form = document.querySelector("#convert-form");
const urlField = document.querySelector("#product-url");
const convertButton = document.querySelector("#convert-button");
const statusPanel = document.querySelector("#status-panel");
const statusTitle = document.querySelector("#status-title");
const statusMessage = document.querySelector("#status-message");
const resultPanel = document.querySelector("#result-panel");
const resultUrl = document.querySelector("#result-url");
const copyButton = document.querySelector("#copy-button");

function showStatus(title, message, success = false) {
  statusPanel.classList.remove("hidden", "success");
  if (success) statusPanel.classList.add("success");
  statusTitle.textContent = title;
  statusMessage.textContent = message;
}
function hideStatus() {
  statusPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
}
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideStatus();

  const url = urlField.value.trim();
  if (!url) {
    showStatus("Thiếu link", "Vui lòng dán link sản phẩm Shopee.");
    return;
  }

  convertButton.disabled = true;
  convertButton.textContent = "Đang kiểm tra…";

  try {
    const response = await fetch("/api/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      showStatus(
        data.error === "API_NOT_CONFIGURED" ? "Chưa bật chuyển đổi thật" : "Không thể chuyển đổi",
        data.message || "Máy chủ không tạo được link. Vui lòng thử lại sau."
      );
      return;
    }

    if (typeof data.affiliateUrl !== "string" || !data.affiliateUrl.startsWith("https://")) {
      showStatus("Phản hồi không hợp lệ", "Máy chủ không trả về link Affiliate hợp lệ.");
      return;
    }
    resultUrl.value = data.affiliateUrl;
    resultPanel.classList.remove("hidden");
    showStatus("Tạo link thành công", "Bạn có thể sao chép link Affiliate bên dưới.", true);
  } catch {
    showStatus("Lỗi kết nối", "Không thể kết nối máy chủ. Vui lòng thử lại.");
  } finally {
    convertButton.disabled = false;
    convertButton.textContent = "Chuyển đổi link";
  }
});

copyButton.addEventListener("click", async () => {
  if (!resultUrl.value) return;
  try {
    await navigator.clipboard.writeText(resultUrl.value);
    copyButton.textContent = "Đã sao chép";
    setTimeout(() => { copyButton.textContent = "Sao chép"; }, 1600);
  } catch {
    resultUrl.focus();
    resultUrl.select();
    showStatus("Chưa thể tự sao chép", "Hãy nhấn giữ hoặc dùng lệnh sao chép trên thiết bị.", false);
  }
});
