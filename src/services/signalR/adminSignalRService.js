import * as signalR from "@microsoft/signalr";

class AdminSignalRService {
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
            .then(() => console.log("Admin connected"))
            .catch((err) => console.error("Lỗi kết nối SignalR: ", err));
    }

    registerOnServerEvents() {
        // Đăng ký nhận thông điệp từ server

        // Khi nhận tin từ user:
        this.connection.on("ReceiveUserMessage", (userId, message) => {
            console.log(`User ${userId} gửi: ${message}`);
        });

        // Nhận thông báo claim:
        this.connection.on("ConversationClaimed", (userId, adminId) => {
            console.log(`Cuộc trò chuyện của user ${userId} đã được claim bởi ${adminId}`);
        });

        // Nhận phản hồi khi gửi tin admin:
        this.connection.on("ReceiveMessage", (message) => {
            console.log("Phản hồi từ server:", message);
        });

        this.connection.on("Error", (error) => {
            console.error("Lỗi:", error);
        });
    }

    claimConversation(userId) {
        this.connection.invoke("ClaimConversation", userId)
            .catch(err => console.error(err));
    }

    // Gửi tin nhắn trả lời cho user (chỉ khi admin đã claim)
    sendMessageToUser(userId, message) {
        this.connection.invoke("SendAdminMessage", userId, message)
            .catch(err => console.error(err));
    }

    // Giải phóng cuộc trò chuyện khi đã xong
    releaseConversation(userId) {
        this.connection.invoke("ReleaseConversation", userId)
            .catch(err => console.error(err));
    }
}

export default new AdminSignalRService();
