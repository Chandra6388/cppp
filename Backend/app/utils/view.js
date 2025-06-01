db.createView(
  "unreadSupportChats",      
  "supportchats",             
  [
    {
      $match: { isRead: false }
    }
  ]
)
