using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    private static Dictionary<string, string> users = new();

    private static readonly Dictionary<string, string> UserRoles = new();

    // send message to all clients
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

    // Set user role and notify 
    public async Task Join(string username, string role)
    {
        UserRoles[Context.ConnectionId] = role;

        await Clients.Caller.SendAsync("ReceiveMessage", "System", $"Joined as {role}");

        await Clients.Caller.SendAsync("ReceiveUserRole", role);
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

    // Only allow teachers to send announcements
    public async Task SendAnnouncement(string message)
    {
        if (!UserRoles.TryGetValue(Context.ConnectionId, out var role))
            return;

        if (role != "teacher")
            return;

        await Clients.All.SendAsync("ReceiveAnnouncement", "Teacher", message);
    }
}