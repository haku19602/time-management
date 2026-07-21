// ==================== 1. 計時器邏輯 ====================
let timer;
let defaultMinutes = 25; // 紀錄使用者設定的分鐘數
let timeLeft = defaultMinutes * 60; // 預設 25 分鐘 (單位: 秒)
let isRunning = false;

const timerDisplay = document.getElementById('timerDisplay');
const rewardModal = document.getElementById('rewardModal');
const rewardVideo = document.getElementById('rewardVideo');
const videoUrl = "https://www.youtube.com/embed/EPO7f7hMnOk?autoplay=1"; // 自動播放獎勵影片

// 更新倒數時間顯示
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 設定快速選擇的時間
function setCustomTime(minutes) {
    if (isRunning) pauseTimer();
    defaultMinutes = minutes;
    timeLeft = minutes * 60;
    updateDisplay();
}

// 設定自訂輸入框的時間
function setCustomInputTime() {
    const input = document.getElementById('customMinutes');
    const minutes = parseInt(input.value);

    if (isNaN(minutes) || minutes <= 0) {
        alert('請輸入大於 0 的有效分鐘數！');
        return;
    }

    if (isRunning) pauseTimer();
    defaultMinutes = minutes;
    timeLeft = minutes * 60;
    updateDisplay();
    input.value = '';
}

// 開始計時
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timer);
            isRunning = false;
            // 倒數結束，跳出獎勵彈出視窗
            showRewardModal();
        }
    }, 1000);
}

// 暫停計時
function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

// 重設計時器
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    timeLeft = defaultMinutes * 60;
    updateDisplay();
}


// ==================== 2. 獎勵彈出視窗 (Modal) 邏輯 ====================
function showRewardModal() {
    // 載入影片網址並觸發自動播放
    rewardVideo.src = videoUrl;
    // 顯示視窗 (將 CSS display 改為 flex)
    rewardModal.style.display = "flex";
}

function closeRewardModal() {
    // 隱藏視窗
    rewardModal.style.display = "none";
    // 清空 iframe src 以停止背景影片聲音
    rewardVideo.src = "";
}

// 點擊 Modal 以外背景區域也可以關閉
window.onclick = function(event) {
    if (event.target === rewardModal) {
        closeRewardModal();
    }
};


// ==================== 3. 行程表 (待辦事項) 邏輯 ====================
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('請先輸入行程內容喔！');
        return;
    }

    const li = document.createElement('li');
    
    const textSpan = document.createElement('span');
    textSpan.textContent = taskText;
    textSpan.style.cursor = 'pointer';
    textSpan.onclick = function() {
        li.classList.toggle('completed');
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '刪除';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = function() {
        taskList.removeChild(li);
    };

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);

    taskInput.value = '';
}

taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});