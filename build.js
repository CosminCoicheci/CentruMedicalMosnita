/**
 * Build script: merges content YAML files with the HTML template and outputs index.html.
 * Run: node build.js
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.resolve(__dirname);
const CONTENT_DIR = path.join(ROOT, 'content');
const SRC_DIR = path.join(ROOT, 'src');
const OUT_INDEX = path.join(ROOT, 'index.html');

function loadYaml(filename) {
  const filepath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf8');
  return yaml.load(raw);
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
      return `
          <div class="col-lg-6" data-aos="fade-up" data-aos-delay="${delay}">
            <div class="team-member d-flex align-items-start">
              <div class="pic"><img src="${escapeHtml(doc.image)}" class="img-fluid" alt=""></div>
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
      (t) => `
                <div class="swiper-slide">
                  <div class="testimonial-item">
                    <div class="d-flex">
                      <img src="${escapeHtml(t.image)}" class="testimonial-img flex-shrink-0" alt="">
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
                </div><!-- End testimonial item -->`
    )
    .join('\n');
}

function buildGalleryImages(images) {
  if (!images || !images.length) return '';
  return images
    .map(
      (img) => `
          <div class="col-lg-3 col-md-4">
            <div class="gallery-item">
              <a href="${escapeHtml(img.path)}" class="glightbox" data-gallery="images-gallery">
                <img src="${escapeHtml(img.path)}" alt="${escapeHtml(img.caption || '')}" class="img-fluid">
              </a>
            </div>
          </div><!-- End Gallery Item -->`
    )
    .join('\n');
}

function buildFooterLinks(links) {
  if (!links || !links.length) return '';
  return links
    .map((item) => `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`)
    .join('\n            ');
}

function main() {
  const site = loadYaml('site.yml');
  const servicesData = loadYaml('services.yml');
  const doctorsData = loadYaml('doctors.yml');
  const testimonialsData = loadYaml('testimonials.yml');
  const galleryData = loadYaml('gallery.yml');

  const hero = site.hero || {};
  const about = site.about || {};
  const contact = site.contact || {};
  const footer = site.footer || {};

  const heroWhyBody = (hero.whyBody || '').replace(/\n/g, ' ');
  const aboutIntro = (about.intro || '').replace(/\n/g, ' ');
  const footerAddress = nl2br(footer.address || '');

  const navItems = buildNavItems(site.nav);
  const iconBoxes = buildIconBoxes(hero.iconBoxes);
  const aboutItems = buildAboutItems(about.items);
  const servicesItems = buildServicesItems(servicesData.services);
  const doctorsItems = buildDoctorsItems(doctorsData.doctors);
  const testimonialsItems = buildTestimonialsItems(testimonialsData.testimonials);
  const galleryImages = buildGalleryImages(galleryData.images);
  const footerLinks1 = buildFooterLinks(footer.links1);
  const footerLinks2 = buildFooterLinks(footer.links2);

  let template = fs.readFileSync(path.join(SRC_DIR, 'index.html'), 'utf8');

  const replacements = [
    ['__SITE_TITLE__', site.title || ''],
    ['__SITE_PHONE1__', site.phone1 || ''],
    ['__SITE_PHONE2__', site.phone2 || ''],
    ['__SITE_SITENAME__', site.sitename || ''],
    ['__NAV_ITEMS__', navItems],
    ['__HERO_IMAGE__', hero.heroImage || ''],
    ['__HERO_HEADLINE__', hero.headline || ''],
    ['__HERO_SUBTITLE__', hero.subtitle || ''],
    ['__HERO_WHY_TITLE__', hero.whyTitle || ''],
    ['__HERO_WHY_BODY__', heroWhyBody],
    ['__HERO_LEARN_MORE__', hero.learnMoreLabel || 'Learn More'],
    ['__ICON_BOXES__', iconBoxes],
    ['__ABOUT_IMAGE__', about.image || ''],
    ['__ABOUT_TITLE__', about.title || ''],
    ['__ABOUT_INTRO__', aboutIntro],
    ['__ABOUT_ITEMS__', aboutItems],
    ['__SERVICES_TITLE__', servicesData.title || ''],
    ['__SERVICES_SUBTITLE__', servicesData.subtitle || ''],
    ['__SERVICES_ITEMS__', servicesItems],
    ['__DOCTORS_TITLE__', doctorsData.title || ''],
    ['__DOCTORS_ITEMS__', doctorsItems],
    ['__TESTIMONIALS_TITLE__', testimonialsData.title || ''],
    ['__TESTIMONIALS_INTRO__', (testimonialsData.intro || '').replace(/\n/g, ' ')],
    ['__TESTIMONIALS_ITEMS__', testimonialsItems],
    ['__GALLERY_TITLE__', galleryData.title || ''],
    ['__GALLERY_DESCRIPTION__', (galleryData.description || '').replace(/\n/g, ' ')],
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

  const formEmail = site.formReceivingEmail;
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

main();
