db.createView(
  "unreadSupportChats",
  "supportchats",
  [
    {
      $match: { isRead: false }
    },
    {
      $addFields: {
        type: "announcement",
        msg: {
          $switch: {
            branches: [
              { case: { $eq: ["chat", "chat"] }, then: "New support msg" },
              { case: { $eq: ["chat", "announcement"] }, then: "New announcement" },
              { case: { $eq: ["chat", "ticketUpdate"] }, then: "Ticket updated" }
            ],
            default: "New notification"
          }
        }
      }
    }
  ]
)
