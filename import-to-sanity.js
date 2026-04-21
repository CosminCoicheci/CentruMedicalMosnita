const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { createClient } = require('@sanity/client');

const ROOT = path.resolve(__dirname);
const CONTENT_DIR = path.join(ROOT, 'content');

const CONTENT_FILES = {
  site: path.join(CONTENT_DIR, 'site.yml'),
  services: path.join(CONTENT_DIR, 'services.yml'),
  doctors: path.join(CONTENT_DIR, 'doctors.yml'),
  testimonials: path.join(CONTENT_DIR, 'testimonials.yml'),
  gallery: path.join(CONTENT_DIR, 'gallery.yml'),
};

const projectId = process.env.SANITY_PROJECT_ID || 'ycekroyx';
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_TOKEN;

if (!token) {
  console.error('Missing SANITY_TOKEN.');
  console.error('Set it and run again:');
  console.error('PowerShell: $env:SANITY_TOKEN="your-token"');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  useCdn: false,
  apiVersion: '2024-01-01',
});

function readYaml(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return yaml.load(raw);
}

function ensureFileExists(absPath) {
  if (!fs.existsSync(absPath)) {
    throw new Error(`Image file not found: ${absPath}`);
  }
}

async function uploadImage(relativePath) {
  if (!relativePath) return null;

  const normalized = String(relativePath).replace(/\\/g, '/');
  const absPath = path.join(ROOT, normalized);
  ensureFileExists(absPath);

  const stream = fs.createReadStream(absPath);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(absPath),
  });

  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  };
}

async function buildSiteDocument(siteData) {
  const heroImage = await uploadImage(siteData?.hero?.heroImage);
  const aboutImage = await uploadImage(siteData?.about?.image);

  return {
    _id: 'site.main',
    _type: 'site',
    title: siteData?.title || '',
    sitename: siteData?.sitename || '',
    phone1: siteData?.phone1 || '',
    phone2: siteData?.phone2 || '',
    nav: Array.isArray(siteData?.nav) ? siteData.nav : [],
    hero: {
      headline: siteData?.hero?.headline || '',
      subtitle: siteData?.hero?.subtitle || '',
      heroImage,
      whyTitle: siteData?.hero?.whyTitle || '',
      whyBody: siteData?.hero?.whyBody || '',
      learnMoreLabel: siteData?.hero?.learnMoreLabel || '',
      iconBoxes: Array.isArray(siteData?.hero?.iconBoxes) ? siteData.hero.iconBoxes : [],
    },
    about: {
      title: siteData?.about?.title || '',
      intro: siteData?.about?.intro || '',
      image: aboutImage,
      items: Array.isArray(siteData?.about?.items) ? siteData.about.items : [],
    },
    contact: {
      title: siteData?.contact?.title || '',
      description: siteData?.contact?.description || '',
      mapSrc: siteData?.contact?.mapSrc || '',
    },
    formReceivingEmail: siteData?.formReceivingEmail || '',
    footer: {
      sitename: siteData?.footer?.sitename || '',
      address: siteData?.footer?.address || '',
      phoneFix: siteData?.footer?.phoneFix || '',
      phoneMobil: siteData?.footer?.phoneMobil || '',
      linksTitle1: siteData?.footer?.linksTitle1 || '',
      links1: Array.isArray(siteData?.footer?.links1) ? siteData.footer.links1 : [],
      linksTitle2: siteData?.footer?.linksTitle2 || '',
      links2: Array.isArray(siteData?.footer?.links2) ? siteData.footer.links2 : [],
      copyright: siteData?.footer?.copyright || '',
      credits: siteData?.footer?.credits || '',
    },
  };
}

function buildServicesDocument(servicesData) {
  return {
    _id: 'services.main',
    _type: 'servicesPage',
    title: servicesData?.title || '',
    subtitle: servicesData?.subtitle || '',
    services: Array.isArray(servicesData?.services) ? servicesData.services : [],
  };
}

async function buildDoctorsDocument(doctorsData) {
  const doctors = Array.isArray(doctorsData?.doctors) ? doctorsData.doctors : [];

  const mappedDoctors = await Promise.all(
    doctors.map(async (doctor) => ({
      name: doctor?.name || '',
      role: doctor?.role || '',
      description: doctor?.description || '',
      image: await uploadImage(doctor?.image),
    }))
  );

  return {
    _id: 'doctors.main',
    _type: 'doctorsPage',
    title: doctorsData?.title || '',
    doctors: mappedDoctors,
  };
}

async function buildTestimonialsDocument(testimonialsData) {
  const testimonials = Array.isArray(testimonialsData?.testimonials)
    ? testimonialsData.testimonials
    : [];

  const mappedTestimonials = await Promise.all(
    testimonials.map(async (item) => ({
      author: item?.author || '',
      role: item?.role || '',
      quote: item?.quote || '',
      image: await uploadImage(item?.image),
    }))
  );

  return {
    _id: 'testimonials.main',
    _type: 'testimonialsPage',
    title: testimonialsData?.title || '',
    intro: testimonialsData?.intro || '',
    testimonials: mappedTestimonials,
  };
}

async function buildGalleryDocument(galleryData) {
  const images = Array.isArray(galleryData?.images) ? galleryData.images : [];

  const mappedImages = await Promise.all(
    images.map(async (img) => ({
      path: await uploadImage(img?.path),
      caption: img?.caption || '',
    }))
  );

  return {
    _id: 'gallery.main',
    _type: 'galleryPage',
    title: galleryData?.title || '',
    description: galleryData?.description || '',
    images: mappedImages,
  };
}

async function main() {
  const siteData = readYaml(CONTENT_FILES.site);
  const servicesData = readYaml(CONTENT_FILES.services);
  const doctorsData = readYaml(CONTENT_FILES.doctors);
  const testimonialsData = readYaml(CONTENT_FILES.testimonials);
  const galleryData = readYaml(CONTENT_FILES.gallery);

  const docs = [];
  docs.push(await buildSiteDocument(siteData));
  docs.push(buildServicesDocument(servicesData));
  docs.push(await buildDoctorsDocument(doctorsData));
  docs.push(await buildTestimonialsDocument(testimonialsData));
  docs.push(await buildGalleryDocument(galleryData));

  for (const doc of docs) {
    await client.createOrReplace(doc);
    console.log(`Upserted ${doc._type} (${doc._id})`);
  }

  console.log('Import complete. Refresh Sanity Studio to see content.');
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
