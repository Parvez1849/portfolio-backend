// backend/models/portfolio.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schemas (Inmein koi change nahi hai)
const BasicDetailsSchema = new Schema({
    companyName: { type: String, default: '' },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
}, { _id: true });

const HeroSchema = new Schema({
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    tagline: { type: String, default: '' },
    profileImage: { type: String, default: '' },
}, { _id: true });

const SocialsSchema = new Schema({
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' },
}, { _id: false });

const AboutSchema = new Schema({
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    socials: { type: SocialsSchema, default: () => ({}) },
}, { _id: true });

const ContactSchema = new Schema({
    message: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
}, { _id: true });

const SkillSchema = new Schema({
    name: { type: String, default: '' },
    level: { type: Number, default: 0 },
});

const ServiceSchema = new Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
});

const ProjectSchema = new Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    link: { type: String, default: '' },
    githubLink: { type: String, default: '' },
});

const TestimonialSchema = new Schema({
    quote: { type: String, default: '' },
    author: { type: String, default: '' },
});

// --- Main Portfolio Schema ---
const PortfolioSchema = new Schema(
    {
        userId: {
            // --- YAHAN CHANGE KIYA GAYA HAI ---
            type: String, // ObjectId ki jagah String
            required: true,
            index: true,
        },
        templateId: {
            type: Number,
            required: true,
        },
        basic: { type: BasicDetailsSchema, default: () => ({}) },
        hero: { type: HeroSchema, default: () => ({}) },
        about: { type: AboutSchema, default: () => ({}) },
        contact: { type: ContactSchema, default: () => ({}) },
        skills: { type: [SkillSchema], default: [] },
        services: { type: [ServiceSchema], default: [] },
        projects: { type: [ProjectSchema], default: [] },
        testimonials: { type: [TestimonialSchema], default: [] },
    },
    {
        timestamps: true,
        minimize: false, 
    }
);

module.exports = mongoose.model('Portfolio', PortfolioSchema);