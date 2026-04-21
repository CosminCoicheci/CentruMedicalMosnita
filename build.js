/**
 * Build script: fetches content from Sanity CMS and merges into the HTML template, outputting index.html.
 * Run: node build.js
 *
 * Required environment variables:
 *   SANITY_PROJECT_ID — your Sanity project ID
 *   SANITY_DATASET    — dataset name (default: "production")
 *   SANITY_TOKEN      — (optional) read token for private datasets
 *
 * Image URLs are resolved via @sanity/image-url using the Sanity image asset references.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');
const imageUrlBuilder = require('@sanity/image-url');

const ROOT = path.resolve(__dirname);
const SRC_DIR = path.join(ROOT, 'src');
const OUT_INDEX = path.join(ROOT, 'index.html');

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'ycekroyx',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN, // optional, for draft content
});

const builder = imageUrlBuilder(client);
function urlFor(source) {
  return builder.image(source).url();
}

// Resolves a Sanity image asset reference to a URL, or returns '' if absent.
function resolveImageUrl(imageField) {
  return imageField ? escapeHtml(urlFor(imageField)) : '';
}

function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nl2br(s) {
  if (s == null) return '';
  return String(s).replace(/\n/g, '<br>\n');
}

function buildNavItems(nav) {
  if (!nav || !nav.length) return '';
  return nav
    .map((item, i) => {
      const active = i === 0 ? ' class="active"' : '';
      return `<li><a href="${escapeHtml(item.href)}"${active}>${escapeHtml(item.label)}</a></li>`;
    })
    .join('\n            ');
}

function buildIconBoxes(boxes) {
  if (!boxes || !boxes.length) return '';
  const delays = [150, 200, 250];
  return boxes
    .map((box, i) => {
      const delay = delays[i] != null ? delays[i] : 100 + i * 50;
      return `
                <div class="col-xl-4 d-flex align-items-stretch">
                  <div class="icon-box" data-aos="zoom-out" data-aos-delay="${delay}">
                    <i class="${escapeHtml(box.icon)}"></i>
                    <h4>${escapeHtml(box.title)}</h4>
                    <p>${escapeHtml(box.text)}</p>
                  </div>
                </div><!-- End Icon Box -->`;
    })
    .join('\n');
}

function buildAboutItems(items) {
  if (!items || !items.length) return '';
  return items
    .map(
      (item) => `
              <li>
                <i class="${escapeHtml(item.icon)}"></i>
                <div>
                  <h5>${escapeHtml(item.title)}</h5>
                  <p>${escapeHtml(item.text)}</p>
                </div>
              </li>`
    )
    .join('\n');
}

function buildServicesItems(services) {
  if (!services || !services.length) return '';
  return services
    .map((svc, i) => {
      const delay = 50 + i * 50;
      const body = (svc.body || '').trim();
      return `
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="service-item position-relative">
              <div class="icon">
                <i class="${escapeHtml(svc.icon)}"></i>
              </div>
              <a href="#" class="stretched-link">
                <h3>${escapeHtml(svc.title)}</h3>
              </a>
              ${body}
              <a href="#" class="stretched-link"></a>
            </div>
          </div><!-- End Service Item -->`;
    })
    .join('\n');
}


function buildDoctorsItems(doctors) {
  if (!doctors || !doctors.length) return '';
  return doctors
    .map((doc, i) => {
      const delay = 50 + i * 50;
      const descHtml = doc.description
        ? `<p>${escapeHtml(doc.description)}</p>`
        : '';
      const imageUrl = resolveImageUrl(doc.image);
      return `
          <div class="col-lg-6" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="team-member d-flex align-items-start">
              <div class="pic"><img src="${imageUrl}" class="img-fluid" alt=""></div>
              <div class="member-info">
                <h4>${escapeHtml(doc.name)}</h4>
                <span>${escapeHtml(doc.role)}</span>
                ${descHtml}
              </div>
            </div>
          </div><!-- End Team Member -->`;
    })
    .join('\n');
}

function buildTestimonialsItems(testimonials) {
  if (!testimonials || !testimonials.length) return '';
  return testimonials
    .map(
      (t) => {
        const imageUrl = resolveImageUrl(t.image);
        return `
                <div class="swiper-slide">
                  <div class="testimonial-item">
                    <div class="d-flex">
                      <img src="${imageUrl}" class="testimonial-img flex-shrink-0" alt="">
                      <div>
                        <h3>${escapeHtml(t.author)}</h3>
                        <h4>${escapeHtml(t.role)}</h4>
                        <div class="stars">
                          <i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i><i class="bi bi-star-fill"></i>
                        </div>
                      </div>
                    </div>
                    <p>
                      <i class="bi bi-quote quote-icon-left"></i>
                      <span>${escapeHtml(t.quote)}</span>
                      <i class="bi bi-quote quote-icon-right"></i>
                    </p>
                  </div>
                </div><!-- End testimonial item -->`;
      }
    )
    .join('\n');
}

function buildGalleryImages(images) {
  if (!images || !images.length) return '';
  return images
    .map(
      (img) => {
        const imageUrl = resolveImageUrl(img.path);
        return `
          <div class="col-lg-3 col-md-4">
            <div class="gallery-item">
              <a href="${imageUrl}" class="glightbox" data-gallery="images-gallery">
                <img src="${imageUrl}" alt="${escapeHtml(img.caption || '')}" class="img-fluid">
              </a>
            </div>
          </div><!-- End Gallery Item -->`;
      }
    )
    .join('\n');
}

function buildFooterLinks(links) {
  if (!links || !links.length) return '';
  return links
    .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
    .join('\n            ');
}

async function main() {
  const site = await client.fetch(`*[_type == "site"][0]`);
  const servicesData = await client.fetch(`*[_type == "servicesPage"][0]`);
  const doctorsData = await client.fetch(`*[_type == "doctorsPage"][0]`);
  const testimonialsData = await client.fetch(`*[_type == "testimonialsPage"][0]`);
  const galleryData = await client.fetch(`*[_type == "galleryPage"][0]`);

  // Fail fast so CI/Netlify does not deploy an empty site if dataset access is missing.
  const missingDocs = [];
  if (!site) missingDocs.push('site');
  if (!servicesData) missingDocs.push('servicesPage');
  if (!doctorsData) missingDocs.push('doctorsPage');
  if (!testimonialsData) missingDocs.push('testimonialsPage');
  if (!galleryData) missingDocs.push('galleryPage');

  if (missingDocs.length) {
    const tokenSet = Boolean(process.env.SANITY_TOKEN);
    throw new Error(
      [
        `Missing required Sanity documents: ${missingDocs.join(', ')}`,
        `Using projectId=${client.config().projectId}, dataset=${client.config().dataset}, tokenSet=${tokenSet}`,
        'If your dataset is private, set SANITY_TOKEN (read token) in local env and Netlify env for all deploy contexts.',
      ].join('\n')
    );
  }

  const hero = (site && site.hero) || {};
  const about = (site && site.about) || {};
  const contact = (site && site.contact) || {};
  const footer = (site && site.footer) || {};

  const heroWhyBody = (hero.whyBody || '').replace(/\n/g, ' ');
  const aboutIntro = (about.intro || '').replace(/\n/g, ' ');
  const footerAddress = nl2br(footer.address || '');

  const heroImageUrl = resolveImageUrl(hero.heroImage);
  const aboutImageUrl = resolveImageUrl(about.image);

  const navItems = buildNavItems(site && site.nav);
  const iconBoxes = buildIconBoxes(hero.iconBoxes);
  const aboutItems = buildAboutItems(about.items);
  const servicesItems = buildServicesItems(servicesData && servicesData.services);
  const doctorsItems = buildDoctorsItems(doctorsData && doctorsData.doctors);
  const testimonialsItems = buildTestimonialsItems(testimonialsData && testimonialsData.testimonials);
  const galleryImages = buildGalleryImages(galleryData && galleryData.images);
  const footerLinks1 = buildFooterLinks(footer.links1);
  const footerLinks2 = buildFooterLinks(footer.links2);

  let template = fs.readFileSync(path.join(SRC_DIR, 'index.html'), 'utf8');

  const replacements = [
    ['__SITE_TITLE__', (site && site.title) || ''],
    ['__SITE_PHONE1__', (site && site.phone1) || ''],
    ['__SITE_PHONE2__', (site && site.phone2) || ''],
    ['__SITE_SITENAME__', (site && site.sitename) || ''],
    ['__NAV_ITEMS__', navItems],
    ['__HERO_IMAGE__', heroImageUrl],
    ['__HERO_HEADLINE__', hero.headline || ''],
    ['__HERO_SUBTITLE__', hero.subtitle || ''],
    ['__HERO_WHY_TITLE__', hero.whyTitle || ''],
    ['__HERO_WHY_BODY__', heroWhyBody],
    ['__HERO_LEARN_MORE__', hero.learnMoreLabel || 'Learn More'],
    ['__ICON_BOXES__', iconBoxes],
    ['__ABOUT_IMAGE__', aboutImageUrl],
    ['__ABOUT_TITLE__', about.title || ''],
    ['__ABOUT_INTRO__', aboutIntro],
    ['__ABOUT_ITEMS__', aboutItems],
    ['__SERVICES_TITLE__', (servicesData && servicesData.title) || ''],
    ['__SERVICES_SUBTITLE__', (servicesData && servicesData.subtitle) || ''],
    ['__SERVICES_ITEMS__', servicesItems],
    ['__DOCTORS_TITLE__', (doctorsData && doctorsData.title) || ''],
    ['__DOCTORS_ITEMS__', doctorsItems],
    ['__TESTIMONIALS_TITLE__', (testimonialsData && testimonialsData.title) || ''],
    ['__TESTIMONIALS_INTRO__', ((testimonialsData && testimonialsData.intro) || '').replace(/\n/g, ' ')],
    ['__TESTIMONIALS_ITEMS__', testimonialsItems],
    ['__GALLERY_TITLE__', (galleryData && galleryData.title) || ''],
    ['__GALLERY_DESCRIPTION__', ((galleryData && galleryData.description) || '').replace(/\n/g, ' ')],
    ['__GALLERY_IMAGES__', galleryImages],
    ['__CONTACT_TITLE__', contact.title || ''],
    ['__CONTACT_DESCRIPTION__', (contact.description || '').replace(/\n/g, ' ')],
    ['__CONTACT_MAP_SRC__', contact.mapSrc || ''],
    ['__FOOTER_SITENAME__', footer.sitename || ''],
    ['__FOOTER_ADDRESS__', footerAddress],
    ['__FOOTER_PHONE_FIX__', footer.phoneFix || ''],
    ['__FOOTER_PHONE_MOBIL__', footer.phoneMobil || ''],
    ['__FOOTER_LINKS_TITLE_1__', footer.linksTitle1 || ''],
    ['__FOOTER_LINKS_1__', footerLinks1],
    ['__FOOTER_LINKS_TITLE_2__', footer.linksTitle2 || ''],
    ['__FOOTER_LINKS_2__', footerLinks2],
    ['__FOOTER_COPYRIGHT__', footer.copyright || ''],
    ['__FOOTER_CREDITS__', footer.credits || ''],
  ];

  for (const [placeholder, value] of replacements) {
    template = template.split(placeholder).join(value);
  }

  fs.writeFileSync(OUT_INDEX, template, 'utf8');
  console.log('Built index.html');

  const formEmail = site && site.formReceivingEmail;
  if (formEmail) {
    const contactPhp = path.join(ROOT, 'forms', 'contact.php');
    const appointmentPhp = path.join(ROOT, 'forms', 'appointment.php');
    for (const filepath of [contactPhp, appointmentPhp]) {
      if (fs.existsSync(filepath)) {
        let content = fs.readFileSync(filepath, 'utf8');
        content = content.replace(
          /\$receiving_email_address\s*=\s*'[^']*'/,
          `$receiving_email_address = '${formEmail.replace(/'/g, "\\'")}'`
        );
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('Updated', path.relative(ROOT, filepath));
      }
    }
  }
}

main().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
