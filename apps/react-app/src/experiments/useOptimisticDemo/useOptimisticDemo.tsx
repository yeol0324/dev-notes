import React, { useState, useOptimistic, useRef, startTransition } from "react";

export function UseOptimisticDemo() {
  const [messages, setMessages] = useState([
    { text: "Hello there!", sending: false, key: 1 },
  ]);

  // delay 1s api
  const deliverMessage = (message: string) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: Date.now(), text: message, completed: false });
      }, 1000);
    });

  async function sendMessageAction(formData: FormData) {
    const sentMessage = await deliverMessage(
      formData?.get("message") as string
    );
    startTransition(() => {
      setMessages((prevMessages) => [
        {
          text: (sentMessage as { text: string }).text,
          sending: false,
          key: Date.now(),
        },
        ...prevMessages,
      ]);
    });
  }

  const formRef = useRef<HTMLFormElement>(null);
  function formAction(formData: FormData) {
    addOptimisticMessage(formData.get("message"));
    formRef.current?.reset();
    startTransition(async () => {
      await sendMessageAction(formData);
    });
  }

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      {
        text: newMessage as string,
        sending: true,
        key: Date.now(),
      },
      ...state,
    ]
  );
  return (
    <>
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
      </form>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
    </>
  );
}
