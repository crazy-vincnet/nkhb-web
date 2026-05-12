import type { Editor } from 'grapesjs';

export const initNKHBBlocks = (editor: Editor) => {
  const bm = editor.BlockManager;
  const domc = editor.DomComponents;
  const category = 'NKHB Components';

  // Helper to create localized traits
  const createLocalizedTraits = (fields: string[]) => {
    const traits: any[] = [];
    fields.forEach(field => {
      if (field === 'image_url') {
        traits.push({ 
          type: 'text',
          name: field, 
          label: 'Image URL' 
        });
      } else {
        traits.push({ 
          type: 'textarea',
          name: `${field}_ko`, 
          label: `${field.charAt(0).toUpperCase() + field.slice(1)} (KO)` 
        });
        traits.push({ 
          type: 'textarea',
          name: `${field}_en`, 
          label: `${field.charAt(0).toUpperCase() + field.slice(1)} (EN)` 
        });
      }
    });
    return traits;
  };

  // Component Definitions
  const componentDefinitions = [
    {
      id: 'nkhb-hero',
      label: 'Hero Section',
      fields: ['tag', 'title', 'subtitle', 'image_url'],
    },
    {
      id: 'nkhb-background',
      label: 'Background Section',
      fields: ['title', 'desc1', 'desc2', 'desc3', 'quote'],
    },
    {
      id: 'nkhb-composition',
      label: 'Composition Section',
      fields: ['title', 'desc'],
    },
    {
      id: 'nkhb-effects',
      label: 'Effects Section',
      fields: ['title', 'desc'],
    },
    {
      id: 'nkhb-quote',
      label: 'Quote Banner',
      fields: ['text'],
    },
    {
      id: 'nkhb-reach',
      label: 'Reach Section',
      fields: ['title', 'desc'],
    },
    {
      id: 'nkhb-guide',
      label: 'Guide Section',
      fields: ['title', 'desc'],
    },
    {
      id: 'nkhb-support',
      label: 'Support Section',
      fields: ['title', 'desc'],
    },
    {
      id: 'nkhb-schedule',
      label: 'Schedule Section',
      fields: ['title', 'desc'],
    },
    {
      id: 'nkhb-about-intro',
      label: 'About Intro',
      fields: ['top_text', 'title', 'p1', 'p2', 'info1', 'info2', 'info3', 'image_url'],
    },
    {
      id: 'nkhb-about-values',
      label: 'About Values',
      fields: [
        'vision_title', 'vision_desc', 
        'mission_title', 'mission_desc',
        'mission_li1', 'mission_li2', 'mission_li3', 'mission_li4', 'mission_li5', 'mission_li6'
      ],
    },
    {
      id: 'nkhb-about-ministry',
      label: 'About Ministry',
      fields: [
        'title', 
        'card1_title', 'card1_desc',
        'card2_title', 'card2_desc',
        'card3_title', 'card3_desc',
        'card4_title', 'card4_desc'
      ],
    },
    {
      id: 'nkhb-about-founder',
      label: 'About Founder',
      fields: [
        'title', 'desc_title', 
        'profile1', 'profile2', 'profile3', 'profile4', 'profile5', 'profile6',
        'book', 'image_url'
      ],
    },
    {
      id: 'nkhb-about-cta',
      label: 'About CTA',
      fields: ['title', 'website_button', 'home_button'],
    },
  ];

  componentDefinitions.forEach(comp => {
    // Register Component Type
    domc.addType(comp.id, {
      model: {
        defaults: {
          name: comp.label,
          draggable: true,
          droppable: false,
          attributes: { class: comp.id },
          traits: createLocalizedTraits(comp.fields),
        },
      },
      view: {
        onRender() {
          const { model, el } = this;
          const attrs = model.getAttributes();
          const titleKey = comp.fields.includes('title') ? 'title_ko' : (comp.fields.includes('text') ? 'text_ko' : '');
          const displayTitle = titleKey ? (attrs[titleKey] || comp.label) : comp.label;
          
          el.style.padding = '20px';
          el.style.border = '2px dashed #ddd';
          el.style.margin = '10px 0';
          el.style.background = '#f9f9f9';
          el.style.borderRadius = '4px';
          el.style.textAlign = 'center';
          el.style.color = '#666';
          
          el.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 5px; color: #333;">${comp.label}</div>
            <div style="font-size: 0.9em;">${displayTitle}</div>
          `;
        }
      }
    });

    // Register Block
    bm.add(comp.id, {
      label: comp.label,
      category,
      content: { type: comp.id },
      attributes: { class: 'fa fa-cube' } // Placeholder icon class
    });
  });
};
