export async function setupPushNotifications(userId: string) {
  // Skip push notification setup in development
  if (!import.meta.env.PROD) {
    console.log('Push notifications are disabled in development mode');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: import.meta.env.PUBLIC_VAPID_PUBLIC_KEY
    });

    // Save subscription to database
    await savePushSubscription({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: btoa(String.fromCharCode.apply(null, 
        new Uint8Array(subscription.getKey('p256dh')))),
      auth: btoa(String.fromCharCode.apply(null, 
        new Uint8Array(subscription.getKey('auth'))))
    });
  } catch (error) {
    console.error('Error setting up push notifications:', error);
  }
}

async function savePushSubscription(subscription: any) {
  const response = await fetch('/api/push-subscription', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
  return response.json();
}