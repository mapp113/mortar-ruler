// 1. Lấy các phần tử giao diện từ DOM
const canvas = document.getElementById('ruler') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const resultInput = document.getElementById('result') as HTMLInputElement;

// Nút điều khiển Vạch Căn (Offset) - Màu Đỏ
const btnOffsetAdd10 = document.getElementById('offset-add-10')!;
const btnOffsetSub10 = document.getElementById('offset-sub-10')!;
const btnOffsetAdd1 = document.getElementById('offset-add-1')!;
const btnOffsetSub1 = document.getElementById('offset-sub-1')!;

// Nút điều khiển Vạch Đích (Target) - Màu Xanh Lá
const btnTargetAdd10 = document.getElementById('target-add-10')!;
const btnTargetSub10 = document.getElementById('target-sub-10')!;
const btnTargetAdd1 = document.getElementById('target-add-1')!;
const btnTargetSub1 = document.getElementById('target-sub-1')!;

// 2. KHAI BÁO TỌA ĐỘ PIXEL (Khôi phục từ Local Storage nếu có)
const lineOriginX = 50; // Vạch gốc cố định 50px

// Đọc giá trị cũ từ LocalStorage, nếu không có thì lấy giá trị mặc định (250 và 450)
let lineOffsetX = Number(localStorage.getItem('ruler_lineOffsetX')) || 250;
let lineTargetX = Number(localStorage.getItem('ruler_lineTargetX')) || 450;

// Lưu trữ kích thước hiển thị hiện tại để vẽ lại khi cần
let currentWidth = window.innerWidth;
let currentHeight = window.innerHeight / 4;

/**
 * Hàm lưu tọa độ hiện tại vào LocalStorage
 */
function saveToLocalStorage() {
  localStorage.setItem('ruler_lineOffsetX', lineOffsetX.toString());
  localStorage.setItem('ruler_lineTargetX', lineTargetX.toString());
}

/**
 * Hàm tính toán kết quả đo dựa trên tỷ lệ pixel
 */
function calculateResult(): string {
  const dOffset = lineOffsetX - lineOriginX;
  const dTarget = lineTargetX - lineOriginX;

  if (dOffset === 0) return "0.00"; // Tránh lỗi chia cho 0

  // Giả sử khoảng cách từ Gốc đến Căn (Offset) đại diện cho mốc 100 đơn vị
  const scale = 100; 
  const result = (dTarget / dOffset) * scale;

  return result.toFixed(2); // Trả về chuỗi làm tròn 2 chữ số thập phân
}

/**
 * Hàm điều chỉnh kích thước Canvas
 */
function resizeCanvas() {
  currentWidth = window.innerWidth;
  currentHeight = window.innerHeight / 4;
  const dpr = window.devicePixelRatio || 1;

  canvas.width = currentWidth * dpr;
  canvas.height = currentHeight * dpr;

  canvas.style.width = `${currentWidth}px`;
  canvas.style.height = `${currentHeight}px`;

  ctx.scale(dpr, dpr);

  updateApp();
}

/**
 * Hàm vẽ một vạch đứng kèm nhãn thông tin
 */
function drawVerticalLine(x: number, height: number, color: string, label: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${label} (${Math.round(x)}px)`, x + 8, 20);
}

/**
 * Hàm cập nhật lại giao diện (Vẽ lại Canvas + Tính toán kết quả đưa vào ô Input)
 */
function updateApp() {
  // Xóa và vẽ nền canvas
  ctx.clearRect(0, 0, currentWidth, currentHeight);
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, currentWidth, currentHeight);

  // Vẽ 3 vạch
  drawVerticalLine(lineOriginX, currentHeight, '#000000', 'Root');
  drawVerticalLine(lineOffsetX, currentHeight, '#ef4444', 'Offset');
  drawVerticalLine(lineTargetX, currentHeight, '#10b981', 'Target');

  // Cập nhật kết quả tính toán vào ô input
  resultInput.value = calculateResult();
}

// 3. HÀM HELPER ĐỂ XỬ LÝ NHẤN GIỮ (LONG PRESS)
function setupAutoRepeat(element: HTMLElement, action: () => void) {
  let pressTimer: number | null = null;
  let repeatTimer: number | null = null;

  const startPress = (e: Event) => {
    e.preventDefault(); // Tránh các hành động scroll mặc định khi chạm trên mobile
    
    // Thực hiện hành động click đơn lẻ ngay lập tức lần đầu tiên
    action();

    // Thiết lập chờ 0.5 giây (500ms)
    pressTimer = window.setTimeout(() => {
      // Sau 0.5s, bắt đầu lặp lại hành động liên tục mỗi 50ms
      repeatTimer = window.setInterval(() => {
        action();
      }, 50); 
    }, 500);
  };

  const endPress = () => {
    // Dọn dẹp cả hai timer khi nhả chuột/tay ra ngoài
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    if (repeatTimer) {
      clearInterval(repeatTimer);
      repeatTimer = null;
    }
    // LƯU LẠI VÀO STORAGE KHI NGƯỜI DÙNG THẢ TAY/CHUỘT RA
    saveToLocalStorage();
  };

  // Sự kiện khi nhấn xuống
  element.addEventListener('mousedown', startPress);
  element.addEventListener('touchstart', startPress, { passive: false });

  // Sự kiện khi nhả ra hoặc di chuột ra ngoài nút
  element.addEventListener('mouseup', endPress);
  element.addEventListener('mouseleave', endPress);
  element.addEventListener('touchend', endPress);
  element.addEventListener('touchcancel', endPress);
}

// 4. LIÊN KẾT HÀNH ĐỘNG CHO CÁC NÚT VỚI BỘ AUTO REPEAT

// Cho Vạch Căn (Offset) - Đỏ
setupAutoRepeat(btnOffsetAdd10, () => {
  lineOffsetX += 10;
  updateApp();
});
setupAutoRepeat(btnOffsetSub10, () => {
  if (lineOffsetX - 10 > lineOriginX) {
    lineOffsetX -= 10;
    updateApp();
  }
});
setupAutoRepeat(btnOffsetAdd1, () => {
  lineOffsetX += 1;
  updateApp();
});
setupAutoRepeat(btnOffsetSub1, () => {
  if (lineOffsetX - 1 > lineOriginX) {
    lineOffsetX -= 1;
    updateApp();
  }
});

// Cho Vạch Đích (Target) - Xanh Lá
setupAutoRepeat(btnTargetAdd10, () => {
  lineTargetX += 10;
  updateApp();
});
setupAutoRepeat(btnTargetSub10, () => {
  if (lineTargetX - 10 > lineOriginX) {
    lineTargetX -= 10;
    updateApp();
  }
});
setupAutoRepeat(btnTargetAdd1, () => {
  lineTargetX += 1;
  updateApp();
});
setupAutoRepeat(btnTargetSub1, () => {
  if (lineTargetX - 1 > lineOriginX) {
    lineTargetX -= 1;
    updateApp();
  }
});

// Lắng nghe sự kiện co giãn màn hình hoặc xoay ngang trên điện thoại
window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => {
  setTimeout(resizeCanvas, 200);
});

// Khởi động ứng dụng lần đầu
resizeCanvas();