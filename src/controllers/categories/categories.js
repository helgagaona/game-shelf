import { getAllCategories, getCategoryById, addCategory, updateCategory, setCategoryActive } from '../../models/catalog/categories.js';

// page for listing categories, accessible to all users
const categoriesListingPage = async (req, res) => {
    const categories = await getAllCategories();
    res.render('dashboard/admin/categories/categories', {
        title: 'Categories',
        categories
    });
};

// page for adding new categories, only accessible to staff and admin users
const categoriesAddPage = (req, res) => {
    res.render('dashboard/admin/categories/add-category', {
        title: 'Add Category',
    });
}

// page for editing categories, only accessible to staff and admin users
const categoriesEditPage = async (req, res, next) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
        const err = new Error(`Category ${categoryId} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('dashboard/admin/categories/edit-category', {
        title: `Edit Category ${category.id}`,
        category
    });
};

// Helper function to read form data and return an object with the expected properties
const readForm = (body) => ({
    name: (body.name || '').trim(),
    description: (body.description || '').trim(),
    isActive: body.is_active === 'true' // matches name="is_active" on the checkbox; an unchecked box sends nothing
});

// route handler for creating a new category
const createCategory = async (req, res, next) => {
    const { name, description, isActive } = readForm(req.body);
    await addCategory(name, description, isActive);
    res.redirect('/admin/categories');
}

// route handler for editing an existing category
const editCategory = async (req, res, next) => {
    const { name, description, isActive } = readForm(req.body);
    const updated = await updateCategory(req.params.id, name, description, isActive);
    if (!updated) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }
    res.redirect('/admin/categories');
};

// Higher-order function to create route handlers for activating/deactivating categories
const changeActive = (isActive) => async (req, res, next) => {
    const updated = await setCategoryActive(req.params.id, isActive);
    if (!updated) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }
    res.redirect('/admin/categories');
};
// Create specific handlers for activating and deactivating categories
const deactivateCategory = changeActive(false);
const activateCategory = changeActive(true);


export { categoriesListingPage, categoriesEditPage, categoriesAddPage, createCategory, editCategory, deactivateCategory, activateCategory };