import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, CardModule, AccordionModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent {
  faqs: FAQItem[] = [
    {
      question: 'How do I create a new audit?',
      answer: 'Navigate to the Area section, choose the relevant area (for example CCPP22 or H Block), then pick the audit form you wish to complete. Each card shows the form name, code, and its group for quick reference.'
    },
    {
      question: 'How can I view reports?',
      answer: 'Go to the Reports section from the main menu. You can choose between Daily Reports and Monthly Reports. Each report can be filtered by date and exported to PDF.'
    },
    {
      question: 'What are the different audit statuses?',
      answer: 'Audits can have the following statuses: Active (currently being worked on), Pending (awaiting review), Completed (finalized and approved), and Submitted (awaiting approval).'
    },
    {
      question: 'How do I export audit data?',
      answer: 'Within any report view, click the "Export PDF" button to download the report. You can also export individual audit forms from the audit detail page.'
    },
    {
      question: 'Who can I contact for support?',
      answer: 'For technical support, please contact the IT Help Desk at support@auditportal.com or call +1-800-AUDIT-HELP.'
    }
  ];

  contactInfo = {
    email: 'support@auditportal.com',
    phone: '+1-800-AUDIT-HELP',
    hours: 'Monday - Friday, 9:00 AM - 5:00 PM EST'
  };
}

