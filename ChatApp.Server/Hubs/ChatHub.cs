using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    // send message to all clients
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    // When a client connects, send a welcome message
    public override async Task OnConnectedAsync()
    {
        await Clients.Caller.SendAsync("ReceiveMessage", "System", "Welcome to the chat!");

        await Clients.All.SendAsync("ReceiveMessage", "System",
            $"User joined: {Context.ConnectionId}");

        await base.OnConnectedAsync();
    }

    // When a client disconnects, notify all clients

    public async Task OnDisconnectedAsync()
    {
        await Clients.All.SendAsync("ReceiveMessage", "System",
            $"User left: {Context.ConnectionId}");

        await base.OnConnectedAsync();
    }

}