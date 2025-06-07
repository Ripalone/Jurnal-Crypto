document.addEventListener('DOMContentLoaded', () => {
    const userBalanceSpan = document.getElementById('user-balance');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const claimMinerBtn = document.getElementById('claim-free-miner');
    const minerMessage = document.getElementById('miner-message');
    const simulateDepositBtn = document.getElementById('simulate-deposit');
    const simulateWithdrawalBtn = document.getElementById('simulate-withdrawal');
    const withdrawalAmountInput = document.getElementById('withdrawal-amount');
    const withdrawalAddressInput = document.getElementById('withdrawal-address');
    const withdrawalMessage = document.getElementById('withdrawal-message');
    const adminUserIdInput = document.getElementById('admin-user-id');
    const adminSetBalanceInput = document.getElementById('admin-set-balance');
    const adminSetBalanceBtn = document.getElementById('admin-set-balance-btn');
    const adminMessage = document.getElementById('admin-message');

    let userBalance = parseFloat(localStorage.getItem('jurnalCryptoBalance')) || 0.00;
    let lastMinerClaimTime = parseInt(localStorage.getItem('lastMinerClaimTime')) || 0;
    let currentTheme = localStorage.getItem('jurnalCryptoTheme') || 'light';

    // Inisialisasi saldo
    userBalanceSpan.textContent = userBalance.toFixed(2);

    // Fungsi untuk menyimpan saldo dan waktu claim miner
    function saveGameState() {
        localStorage.setItem('jurnalCryptoBalance', userBalance.toFixed(2));
        localStorage.setItem('lastMinerClaimTime', lastMinerClaimTime);
    }

    // Fungsi untuk mengatur tema
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        localStorage.setItem('jurnalCryptoTheme', theme);
        currentTheme = theme;
    }

    // Terapkan tema saat halaman dimuat
    applyTheme(currentTheme);

    // Toggle tema
    themeToggleBtn.addEventListener('click', () => {
        if (currentTheme === 'light') {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    });

    // Simulasikan Deposit
    simulateDepositBtn.addEventListener('click', () => {
        userBalance += 1.00; // Setiap deposit fiktif menambah 1 USDT
        userBalanceSpan.textContent = userBalance.toFixed(2);
        saveGameState();
        alert('Simulasi Deposit Berhasil! Saldo Anda bertambah 1.00 USDT.');
    });

    // Klaim Miner Gratis
    claimMinerBtn.addEventListener('click', () => {
        const currentTime = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 jam dalam milidetik

        if (currentTime - lastMinerClaimTime >= twentyFourHours) {
            userBalance += 0.01;
            userBalanceSpan.textContent = userBalance.toFixed(2);
            lastMinerClaimTime = currentTime;
            minerMessage.textContent = 'Selamat! Anda mendapatkan 0.01 USDT dari miner gratis.';
            minerMessage.style.color = 'green';
            saveGameState();
        } else {
            const timeRemaining = twentyFourHours - (currentTime - lastMinerClaimTime);
            const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
            const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
            minerMessage.textContent = `Miner gratis belum siap. Tunggu ${hours} jam, ${minutes} menit, ${seconds} detik lagi.`;
            minerMessage.style.color = 'orange';
        }
    });

    // Simulasikan Penarikan
    simulateWithdrawalBtn.addEventListener('click', () => {
        const amount = parseFloat(withdrawalAmountInput.value);
        const address = withdrawalAddressInput.value.trim();

        if (isNaN(amount) || amount <= 0) {
            withdrawalMessage.textContent = 'Masukkan jumlah penarikan yang valid.';
            withdrawalMessage.style.color = 'red';
            return;
        }

        if (amount > userBalance) {
            withdrawalMessage.textContent = 'Saldo tidak cukup untuk penarikan ini.';
            withdrawalMessage.style.color = 'red';
            return;
        }

        if (address === '') {
            withdrawalMessage.textContent = 'Masukkan alamat dompet fiktif.';
            withdrawalMessage.style.color = 'red';
            return;
        }

        userBalance -= amount;
        userBalanceSpan.textContent = userBalance.toFixed(2);
        saveGameState();
        withdrawalMessage.textContent = `Simulasi penarikan ${amount.toFixed(2)} USDT ke ${address} berhasil!`;
        withdrawalMessage.style.color = 'green';
        withdrawalAmountInput.value = '';
        withdrawalAddressInput.value = '';
    });

    // Panel Admin (Hanya Anda yang Bisa Akses)
    // Untuk permainan, ini tidak benar-benar membatasi akses, hanya simulasi
    adminSetBalanceBtn.addEventListener('click', () => {
        const userId = adminUserIdInput.value.trim();
        const newBalance = parseFloat(adminSetBalanceInput.value);

        if (userId === '') {
            adminMessage.textContent = 'Masukkan nama pengguna fiktif.';
            adminMessage.style.color = 'red';
            return;
        }
        if (isNaN(newBalance) || newBalance < 0) {
            adminMessage.textContent = 'Masukkan saldo yang valid.';
            adminMessage.style.color = 'red';
            return;
        }

        // Dalam permainan ini, kita hanya akan mengubah saldo "Anda"
        // Jika Anda ingin mengelola saldo pengguna lain (dalam simulasi), Anda akan memerlukan array atau objek untuk menyimpannya
        // Untuk saat ini, kita anggap 'Anda' adalah satu-satunya pengguna yang dikelola admin
        if (userId.toLowerCase() === 'admin' || userId.toLowerCase() === 'saya') { // Ini bisa Anda ganti dengan username fiktif Anda
            userBalance = newBalance;
            userBalanceSpan.textContent = userBalance.toFixed(2);
            saveGameState();
            adminMessage.textContent = `Saldo pengguna '${userId}' berhasil diatur ke ${newBalance.toFixed(2)} USDT.`;
            adminMessage.style.color = 'green';
        } else {
            adminMessage.textContent = `Pengguna '${userId}' tidak ditemukan (dalam simulasi ini).`;
            adminMessage.style.color = 'orange';
        }
        adminUserIdInput.value = '';
        adminSetBalanceInput.value = '';
    });
});
