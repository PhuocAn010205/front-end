document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const method = document.querySelector('input[name="method"]:checked').value;
    const otpSection = document.getElementById('otpSection');
    
    if (method === 'ev') {
        // Thanh toán bằng ví EV
        const balance = parseInt(document.getElementById('walletBalance').textContent.replace(/\D/g, ''));
        const total = parseInt(document.getElementById('totalAmount').textContent.replace(/\D/g, ''));
        
        if (balance >= total) {
            alert(`Thanh toán thành công bằng Ví EV!\nĐã trừ: ${total.toLocaleString()}đ\nSố dư còn lại: ${(balance - total).toLocaleString()}đ`);
            // TODO: Gọi API trừ tiền
        } else {
            alert('Số dư ví không đủ!');
        }
    } else {
        // Hiển thị OTP cho ngân hàng/thẻ
        otpSection.style.display = 'block';
        document.getElementById('otp').focus();
        
        // Xử lý OTP (mẫu)
        document.getElementById('otp').addEventListener('input', function() {
            if (this.value.length === 6) {
                alert('Thanh toán thành công bằng ' + (method === 'bank' ? 'Ngân hàng' : 'Thẻ tín dụng') + '!');
                otpSection.style.display = 'none';
                this.value = '';
                // TODO: Gọi API thanh toán
            }
        });
    }
});

// Tự động ẩn OTP khi đổi phương thức
document.querySelectorAll('input[name="method"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.getElementById('otpSection').style.display = 'none';
    });
});