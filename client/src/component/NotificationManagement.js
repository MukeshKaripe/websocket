import React, { useEffect, useState } from 'react';
import { Smile, Paperclip, Send, Bell } from 'lucide-react';

const NotificationManager = {
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('Browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  async showNotification(title, options = {}) {
    if (await this.requestPermission()) {
      try {
        const notification = new Notification(title, {
          icon: '/path/to/your/icon.png', // Add your app icon path
          badge: '/path/to/your/badge.png', // Add your badge icon path
          ...options
        });

        notification.onclick = function() {
          window.focus();
          notification.close();
        };

        return notification;
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  }
};
export default NotificationManager;