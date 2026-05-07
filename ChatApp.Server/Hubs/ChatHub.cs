using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    private static Dictionary<string, string> users = new();

    // send message to all clients
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    // When a client connects, extract username and notify all clients
    public override async Task OnConnectedAsync()
    {
        var username = Context.GetHttpContext()?.Request.Query["username"].ToString() ?? "Anonymous";

        // Store the connection mapping
        users[Context.ConnectionId] = username;

        await Clients.Caller.SendAsync("ReceiveMessage", "System", "Welcome to the chat!");

        await Clients.Caller.SendAsync("ReceiveUsername", username);

        // Notify all clients that a user joined
        await Clients.All.SendAsync("ReceiveMessage", "System",
            $"User joined: {username}");

        await base.OnConnectedAsync();
    }

    // When a client disconnects, notify all clients
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (users.TryGetValue(Context.ConnectionId, out var username))
        {
            users.Remove(Context.ConnectionId);

            await Clients.All.SendAsync("ReceiveMessage", "System",
                $"User left: {username}");
        }

        await base.OnDisconnectedAsync(exception);
    }
}