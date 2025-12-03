import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function AccordionDemo() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full max-w-3xl mx-auto mt-10 text-black"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-xl font-bold">What is FastChat?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance text-lg leading-tight">
          <p>
            FastChat is a modern, real-time messaging app designed to help you
            chat faster, smoother, and more securely.
          </p>
          <p>
            With lightning-fast delivery and an easy-to-use interface, it feels
            like texting on steroids — but cleaner.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger className="text-xl font-bold">Is my data secure?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance text-lg leading-tight">
          <p>
            Absolutely. All messages are encrypted and stored securely. Your
            conversations stay between you and the person you’re chatting with.
          </p>
          <p>
            We follow industry-grade security standards to keep everything
            locked tight.
          </p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger className="text-xl font-bold">What features do you offer?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance text-lg leading-tight">
          <p>FastChat includes:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Real-time one-to-one chats</li>
            <li>Typing indicators & message read status</li>
            <li>Media sharing (photos, videos)</li>
            <li>Cloud sync across all your devices</li>
            <li>Clean, distraction-free UI</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
