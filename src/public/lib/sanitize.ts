import DOMPurify from 'dompurify';

// iframes are allowed for embeds, but only from these hosts.
const IFRAME_HOSTS = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com|google\.com\/maps)\//i;

DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (data.tagName === 'iframe' && !IFRAME_HOSTS.test((node as Element).getAttribute('src') || '')) {
    node.parentNode?.removeChild(node);
  }
});

/** Sanitize CMS HTML (posts, GrapesJS pages): keeps <style> and whitelisted embed iframes. */
export const sanitizeCmsHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    ADD_TAGS: ['style', 'iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
    FORCE_BODY: true,
  });
