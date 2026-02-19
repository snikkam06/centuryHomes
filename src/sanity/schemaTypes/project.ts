import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Internal Title',
            type: 'string',
            description: 'For internal reference only (e.g. "Lot 69 Kinley")',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'lotNumber',
            title: 'Lot Number',
            type: 'string',
            description: 'e.g. "Lot # 69"',
        }),
        defineField({
            name: 'address',
            title: 'Address',
            type: 'string',
            description: 'e.g. "108 Kinley Loop"',
        }),
        defineField({
            name: 'bedrooms',
            title: 'Bedrooms',
            type: 'number',
        }),
        defineField({
            name: 'bathrooms',
            title: 'Bathrooms',
            type: 'number',
        }),
        defineField({
            name: 'sqFt',
            title: 'Square Footage',
            type: 'number',
        }),
        defineField({
            name: 'mainImage',
            title: 'Main Render/Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Available', value: 'available' },
                    { title: 'Pending', value: 'pending' },
                    { title: 'Sold', value: 'sold' },
                    { title: 'Under Contract', value: 'underContract' },
                    { title: 'Under Construction', value: 'underConstruction' },
                ],
            },
            initialValue: 'available',
        }),
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'address',
            media: 'mainImage',
        },
    },
})
