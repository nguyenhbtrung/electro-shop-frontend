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
            .then(() => console.log("User connected"))
            .catch((err) => console.error("Lỗi kết nối SignalR: ", err));
    }

    registerOnServerEvents() {
        // Đăng ký nhận thông điệp từ server
        // this.connection.on("ReceiveMessage", (user, message) => {
        //     console.log("Nhận tin nhắn:", user, message);
        //     // Tại đây bạn có thể trigger một thay đổi state hoặc gọi callback để cập nhật UI
        // });

        this.connection.on("ReceiveAdminMessage", (message) => {
            console.log("Tin từ server:", message);
        });

        this.connection.on("ConversationClaimed", (adminId) => {
            console.log(`Quản trị viên ${adminId} đã tiếp nhận cuộc trò chuyện của bạn.`);
        });
        // this.connection.on("Test", (userId) => {
        //     console.error("Test:", userId);
        // });
    }

    // sendMessage(user, message) {
    //     // Gọi phương thức trên server để gửi tin nhắn
    //     this.connection.invoke("SendMessage", user, message)
    //         .catch(err => console.error(err));
    // }

    sendUserMessage(message) {
        this.connection.invoke("SendMessageToAdmins", message)
            .catch(err => console.error(err));
    }


}

export default new SignalRService();
