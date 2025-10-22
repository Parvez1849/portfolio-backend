// backend/models/portfolio.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Sub-schemas for nested objects
// We ensure Mongoose handles _id automatically for subdocuments by default
const BasicDetailsSchema = new Schema({
    companyName: { type: String, default: '' },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
}, { _id: true }); // Mongoose adds _id by default, explicitly stating for clarity

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
}, { _id: false }); // No separate _id needed for socials within about

const AboutSchema = new Schema({
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    socials: { type: SocialsSchema, default: () => ({}) }, // Default to empty object
}, { _id: true });

const ContactSchema = new Schema({
    message: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
}, { _id: true });


// Sub-schemas for arrays (Mongoose handles _id for array elements)
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
});

const TestimonialSchema = new Schema({
    quote: { type: String, default: '' },
    author: { type: String, default: '' },
});

// --- Main Portfolio Schema ---
const PortfolioSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId, // Correct type for referencing User
            ref: 'User',
            required: true,
            index: true, // Add index for faster lookups by user
        },
        templateId: {
            type: Number,
            required: true,
        },
        // Embed the sub-schemas
        basic: { type: BasicDetailsSchema, default: () => ({}) },
        hero: { type: HeroSchema, default: () => ({}) },
        about: { type: AboutSchema, default: () => ({}) },
        contact: { type: ContactSchema, default: () => ({}) },
        // Embed arrays of sub-schemas
        skills: { type: [SkillSchema], default: [] },
        services: { type: [ServiceSchema], default: [] },
        projects: { type: [ProjectSchema], default: [] },
        testimonials: { type: [TestimonialSchema], default: [] },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt
        minimize: false, // Prevent Mongoose from removing empty objects {}
    }
);

module.exports = mongoose.model('Portfolio', PortfolioSchema);