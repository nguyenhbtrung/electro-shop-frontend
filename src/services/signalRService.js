import * as signalR from "@microsoft/signalr";

class SignalRService {
    constructor() {
        const token = localStorage.getItem("access_token");

        // Khởi tạo kết nối tới Hub tại địa chỉ /chathub
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7169/chathub", {
                accessTokenFactory: () => {
                    return token;
                }
            }) // Chỉnh sửa URL phù hợp với API của bạn
            .withAutomaticReconnect()
            .build();

        this.registerOnServerEvents();
    }

    startConnection() {
        this.connection
            .start()
            .then(() => console.log("Kết nối SignalR thành công"))
            .catch((err) => console.error("Lỗi kết nối SignalR: ", err));
    }

    registerOnServerEvents() {
        // Đăng ký nhận thông điệp từ server
        this.connection.on("ReceiveMessage", (user, message) => {
            console.log("Nhận tin nhắn:", user, message);
            // Tại đây bạn có thể trigger một thay đổi state hoặc gọi callback để cập nhật UI
        });
    }

    sendMessage(user, message) {
        // Gọi phương thức trên server để gửi tin nhắn
        this.connection.invoke("SendMessage", user, message)
            .catch(err => console.error(err));
    }
}

export default new SignalRService();
