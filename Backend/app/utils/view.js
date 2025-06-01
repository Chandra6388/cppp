db.createView(
  "unreadSupportChats",       // View name
  "supportchats",             // Source collection
  [
    {
      $match: { isRead: false }
    }
  ]
)
