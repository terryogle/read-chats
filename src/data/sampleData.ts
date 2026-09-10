import { Conversation, Message } from '../types';

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-101',
    session_id: 'ses_gor_98214',
    customer_name: 'Elena Rostova',
    customer_email: 'elena.rostova@wellnesscenter.com',
    status: 'open',
    ticket_type: 'inquiry',
    series: 'Platinum',
    issue_description: 'Custom PEMF frequencies 1-25 Hz & Square Waves',
    last_message: 'Does the Platinum Mat 7224 support custom PEMF frequency programs between 1-30 Hz?',
    last_message_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(), // 4m ago
    created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    category: 'Product Specifications',
    tags: ['platinum-mat', 'pemf', 'infrared'],
    messages_count: 6,
    unread: true,
    read_at: null,
  },
  {
    id: 'conv-102',
    session_id: 'ses_gor_41902',
    customer_name: 'Marcus Vance',
    customer_email: 'm.vance@chirohealth.net',
    status: 'pending',
    ticket_type: 'problem',
    series: 'Jet',
    issue_description: 'LED Controller E1 Error / Thermal Pin Connection',
    last_message: 'The reset procedure for the LED controller worked! Heat is now regulating accurately.',
    last_message_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(), // 28m ago
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    category: 'Hardware Troubleshooting',
    tags: ['jet-mat', 'controller-e1', 'troubleshooting'],
    messages_count: 4,
    unread: false,
    read_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    kb_submission: {
      id: 'kb-sub-102',
      submitted_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      comment: 'Add clear troubleshooting step: unplugging the 5-pin mat connector for 10 seconds clears E1 memory error.',
      links: [
        {
          id: 'link-1',
          url: 'https://healthyline.com/troubleshooting-guide#controller-reset',
          title: 'Official Controller Reset Manual'
        }
      ],
      category: 'Hardware Troubleshooting',
      submitted_by: 'Support Agent (Elena M.)',
      status: 'pending_review'
    }
  },
  {
    id: 'conv-103',
    session_id: 'ses_gor_33819',
    customer_name: 'Sophie Laurent',
    customer_email: 'sophie.laurent@spasolutions.fr',
    status: 'resolved',
    ticket_type: 'return',
    series: 'TAO',
    issue_description: 'Duplicate Order Refund for Protective Cover ($89.00)',
    last_message: 'Your replacement waterproof protective cover for Order #HL-9821 has shipped via FedEx tracking #9400111899.',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    category: 'Billing & Payments',
    tags: ['refund', 'stripe', 'billing'],
    messages_count: 5,
    unread: false,
    read_at: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString(),
    gorgias_handoff: {
      ticket_id: 'GOR-84291',
      forwarded_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      forwarded_by: 'Alex Rivera (Support Lead)',
      priority: 'high',
      department: 'Billing & Accounting',
      internal_note: 'Verified duplicate charge on gateway. Stripe refund initiated.'
    }
  },
  {
    id: 'conv-104',
    session_id: 'ses_gor_77192',
    customer_name: 'Devon Miller',
    customer_email: 'dmiller@holisticclinic.org',
    status: 'open',
    ticket_type: 'inquiry',
    series: 'InfraMat Pro',
    issue_description: 'Joint Replacement & Surgical Implant Contraindications',
    last_message: 'Can I use the Far Infrared Amethyst Mat while having a knee joint replacement?',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 98).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    category: 'Health & Safety Contraindications',
    tags: ['amethyst-mat', 'contraindications', 'safety'],
    messages_count: 2,
    unread: true,
    read_at: null,
  },
  {
    id: 'conv-105',
    session_id: 'ses_gor_55102',
    customer_name: 'Aisha Patel',
    customer_email: 'aisha@zenithwellness.co',
    status: 'resolved',
    ticket_type: 'warranty',
    series: 'Rainbow Chakra',
    issue_description: '5-Year Extended Warranty Registration #HL-MAT-78401',
    last_message: 'The 5-year extended warranty certificate has been registered to serial number HL-MAT-78401.',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(), // 6 days ago
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 150).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
    category: 'Warranty & Registration',
    tags: ['chakra', 'warranty-5yr', 'serial-number'],
    messages_count: 4,
    unread: false,
    read_at: new Date(Date.now() - 1000 * 60 * 60 * 140).toISOString(),
  },
  {
    id: 'conv-106',
    session_id: 'ses_gor_62940',
    customer_name: 'Carlos Mendez',
    customer_email: 'carlos.m@recoverylab.io',
    status: 'pending',
    ticket_type: 'problem',
    series: 'Platinum',
    issue_description: 'Photon 660nm Red Light Auto-Shutoff Timer Protocol',
    last_message: 'What is the maximum continuous operation timer recommendation for photon light therapy?',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(), // 18 days ago
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 19).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    category: 'Product Protocols',
    tags: ['photon-light', 'red-light', 'protocol'],
    messages_count: 2,
    unread: false,
    read_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 17).toISOString(),
  },
  {
    id: 'conv-107',
    session_id: 'ses_gor_19485',
    customer_name: 'Victor Bergman',
    customer_email: 'v.bergman@apexphysio.de',
    status: 'open',
    ticket_type: 'return',
    series: 'Jet',
    issue_description: 'Prepaid Return Label Request (90-day trial exchange)',
    last_message: 'We would like to request a prepaid return label for our Jet Travel Mat under your 90-day trial program.',
    last_message_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 46).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    category: 'Returns & RMA',
    tags: ['jet-travel', 'return-label', 'trial'],
    messages_count: 4,
    unread: true,
    read_at: null,
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  'conv-101': [
    {
      id: 'msg-101-1',
      conversation_id: 'conv-101',
      sender_type: 'customer',
      content: 'Hi there! We are currently evaluating upgrading our clinic with multiple HealthyLine Platinum Mat 7224 units. I wanted to verify the exact PEMF capabilities before placing our order.',
      created_at: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 64).toISOString(),
    },
    {
      id: 'msg-101-2',
      conversation_id: 'conv-101',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: "Hello Elena! 👋 Welcome to HealthyLine Customer Support. I'd be delighted to assist you with the Platinum Mat 7224 specifications.\n\nThe Platinum Series is our premier line combining 5 advanced wellness therapies: **Pulsed Electromagnetic Field (PEMF)**, **Far Infrared Rays (FIR)**, **Negative Ion Therapy**, **Photon Red Light (660nm)**, and **Natural Gemstone Therapy** (Amethyst, Tourmaline, Jade, Obsidian, and Quartz).\n\nWhat specific PEMF requirements would you like to verify for your clinic?",
      created_at: new Date(Date.now() - 1000 * 60 * 64).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 63).toISOString(),
    },
    {
      id: 'msg-101-3',
      conversation_id: 'conv-101',
      sender_type: 'customer',
      content: 'Does the Platinum Mat 7224 support custom PEMF frequency programs between 1-30 Hz, and can we select specific waveforms like sine or square wave?',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
    },
    {
      id: 'msg-101-4',
      conversation_id: 'conv-101',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: `Yes, absolutely! The Platinum Series controller provides full digital PEMF customization:

* **Frequency Range:** Fully adjustable from **1 Hz to 25 Hz** in 1 Hz increments, plus preset Schumann Resonances (7.83 Hz).
* **Waveforms:** Switchable between **Sine wave** (gentle, relaxing biorhythms) and **Square wave** (rapid rise, energizing tissue stimulation).
* **Pulse Duration & Intensity:** Adjustable intensity up to 3 Gauss (300 microtesla) with pulsed cycles (e.g., 20 minutes on, 100 minutes off for sleep protocols).
* **Independent Therapy Controls:** You can run PEMF independently from Far Infrared heat or Photon light therapy depending on client tolerance.

Would you like me to send you the official clinical protocol guide or connect you with our commercial accounts manager for bulk clinic pricing?`,
      created_at: new Date(Date.now() - 1000 * 60 * 29).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
    },
    {
      id: 'msg-101-5',
      conversation_id: 'conv-101',
      sender_type: 'customer',
      content: 'Does the Platinum Mat 7224 support custom PEMF frequency programs between 1-30 Hz?',
      created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      is_read: false,
      read_at: null,
    },
    {
      id: 'msg-101-6',
      conversation_id: 'conv-101',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: "Yes, it does! The digital controller allows custom selection from 1 to 25 Hz, as well as preset Schumann resonance frequencies. If you need custom commercial quotes for multiple mats, I can flag this conversation directly to our commercial sales specialist.",
      created_at: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      is_read: false,
      read_at: null,
    }
  ],

  'conv-102': [
    {
      id: 'msg-102-1',
      conversation_id: 'conv-102',
      sender_type: 'customer',
      content: "Hello, my HealthyLine Jet Series controller is displaying an error code 'E1' and the mat is not heating up above room temperature. Is there a reset sequence?",
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 179).toISOString(),
    },
    {
      id: 'msg-102-2',
      conversation_id: 'conv-102',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: `Hi Marcus! The 'E1' error indicates a temporary connection disconnect between the controller connector and the mat's internal thermal sensor pins.

### Recommended Quick Reset for Jet Series:
1. Turn off the power switch on the back of the controller and unplug it from the wall outlet.
2. Firmly unplug the multi-pin connector connecting the controller cord directly into the mat port.
3. Check the internal pins to make sure there is no dust, then re-insert the connector firmly until you hear/feel a secure lock.
4. Plug the controller directly into a grounded wall outlet (avoid ungrounded power strips).
5. Turn the power switch back on and set temperature to 45°C (113°F).`,
      created_at: new Date(Date.now() - 1000 * 60 * 178).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 177).toISOString(),
    },
    {
      id: 'msg-102-3',
      conversation_id: 'conv-102',
      sender_type: 'customer',
      content: 'The reset procedure for the LED controller worked! Heat is now regulating accurately.',
      created_at: new Date(Date.now() - 1000 * 60 * 28).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 27).toISOString(),
    },
    {
      id: 'msg-102-4',
      conversation_id: 'conv-102',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: "Wonderful! We are so glad to hear your HealthyLine Jet mat is heating properly again. Don't hesitate to reach back out if you ever need additional support or replacement accessories.",
      created_at: new Date(Date.now() - 1000 * 60 * 27).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 26).toISOString(),
    }
  ],

  'conv-103': [
    {
      id: 'msg-103-1',
      conversation_id: 'conv-103',
      sender_type: 'customer',
      content: "Hi, I was charged twice for this month's replacement cover on my TAO Mat #HL-9821. Could someone please inspect this and issue a refund for the duplicate $89 charge?",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 'msg-103-2',
      conversation_id: 'conv-103',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: "Hello Sophie! I understand how concerning duplicate billing can be. Let me immediately cross-reference order #HL-9821 against your account ledger.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5 + 30000).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: 'msg-103-3',
      conversation_id: 'conv-103',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: "I have verified your billing records: there was an automated retry collision on the payment gateway, resulting in two $89.00 transactions. I have issued a full credit refund for transaction #TXN-492048.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: 'msg-103-4',
      conversation_id: 'conv-103',
      sender_type: 'customer',
      content: "Thank you! How long does the return usually take to appear on my card statement?",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3 - 60000).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: 'msg-103-5',
      conversation_id: 'conv-103',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: 'Your refund of $89.00 has been initiated to your card ending in 4102. Please allow 3-5 business days depending on your financial institution.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    }
  ],

  'conv-104': [
    {
      id: 'msg-104-1',
      conversation_id: 'conv-104',
      sender_type: 'customer',
      content: 'Can I use the Far Infrared Amethyst Mat while having a knee joint replacement?',
      created_at: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 41).toISOString(),
    },
    {
      id: 'msg-104-2',
      conversation_id: 'conv-104',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: `Hello Devon, thank you for checking with us. Safety is our top priority at HealthyLine.

### Important Medical Contraindication Guidelines:
* **Metal or Titanium Implants:** Far infrared deep thermal heat can be absorbed differently by surgical hardware. While low levels of heat (up to 40°C / 104°F) are commonly tolerated, high thermal settings directly over implants should be avoided without physician sign-off.
* **PEMF Caution:** While titanium/surgical grade metals are non-ferromagnetic, we advise keeping PEMF intensity low and consulting your orthopedic surgeon prior to applying magnetic fields directly over joint replacements.
* **Negative Ions & Gemstones:** Non-thermal gemstone sessions and negative ion therapy have no hardware contraindications.`,
      created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      is_read: false,
      read_at: null,
    }
  ],

  'conv-105': [
    {
      id: 'msg-105-1',
      conversation_id: 'conv-105',
      sender_type: 'customer',
      content: 'I recently bought a Rainbow Chakra Mat and wanted to verify that my warranty registration was received.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
    },
    {
      id: 'msg-105-2',
      conversation_id: 'conv-105',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: 'Hi Aisha! I would be glad to check your registration record. Could you confirm the serial number located on the tag on the underside of your mat?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 11).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    },
    {
      id: 'msg-105-3',
      conversation_id: 'conv-105',
      sender_type: 'customer',
      content: 'The serial number on the tag is HL-MAT-78401.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
    {
      id: 'msg-105-4',
      conversation_id: 'conv-105',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: 'The 5-year extended warranty certificate has been registered to serial number HL-MAT-78401. Your mat is fully protected against electronic and thermal defects.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    }
  ],

  'conv-106': [
    {
      id: 'msg-106-1',
      conversation_id: 'conv-106',
      sender_type: 'customer',
      content: 'What is the maximum continuous operation timer recommendation for photon light therapy?',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    },
    {
      id: 'msg-106-2',
      conversation_id: 'conv-106',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: 'Hello Carlos! For HealthyLine mats with **660nm Red Photon Light Therapy**, the recommended session time is **20 to 30 minutes** once or twice per day. The controller auto-shuts off the photon lights after 30 minutes to preserve LED diode longevity.',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 60 * 13).toISOString(),
    }
  ],

  'conv-107': [
    {
      id: 'msg-107-1',
      conversation_id: 'conv-107',
      sender_type: 'customer',
      content: 'Hello, we would like to initiate a return for our HealthyLine Jet Travel Mat under your 90-day trial policy. The size is a bit small for our physical therapy clinic treatment table.',
      created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 89).toISOString(),
    },
    {
      id: 'msg-107-2',
      conversation_id: 'conv-107',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: 'Hello Victor! We completely understand. Our 90-day trial allows hassle-free returns or exchanges for a larger full-size mat (such as the Jet Full Pro or Platinum 7224).\n\nWould you prefer a prepaid return shipping label for a refund, or would you like to apply your credit toward upgrading to a full-body clinic model?',
      created_at: new Date(Date.now() - 1000 * 60 * 88).toISOString(),
      is_read: true,
      read_at: new Date(Date.now() - 1000 * 60 * 87).toISOString(),
    },
    {
      id: 'msg-107-3',
      conversation_id: 'conv-107',
      sender_type: 'customer',
      content: 'We would like to request a prepaid return label for our Jet Travel Mat under your 90-day trial program.',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      is_read: false,
      read_at: null,
    },
    {
      id: 'msg-107-4',
      conversation_id: 'conv-107',
      sender_type: 'ai',
      model_name: 'HealthyLine AI Support',
      content: 'I have created return authorization #RMA-84920 for your Jet Travel Mat. A prepaid FedEx return label has been emailed to v.bergman@apexphysio.de. Once received at our warehouse, your full refund will be processed within 24 hours.',
      created_at: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      is_read: false,
      read_at: null,
    }
  ]
};
