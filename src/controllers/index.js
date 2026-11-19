// Route handlers for static pages

const homePage = (req, res) => {
    res.render('home', {
        title: 'Game Shelf',
    });
};

const testErrorPage = (req, res, next) => {
    const err = new Error('This is a test error');
    err.status = 500;
    next(err);
};

const registrationPage = (req, res) => {
    res.render('forms/registration', {
        title: 'Registration',
    });
};

const loginPage = (req, res) => {
    res.render('forms/login', {
        title: 'Login',
    });
};

const adminDashboard = (req, res) => {
    res.render('dashboard/admin', {
        title: 'Admin Dashboard',
    });
}

const staffDashboard = (req, res) => {
    res.render('dashboard/staff', {
        title: 'Staff Dashboard',
    });
}
const memberDashboard = (req, res) => {
    res.render('dashboard/member', {
        title: 'Member Dashboard',
    });
}




export { homePage, testErrorPage, registrationPage, loginPage, adminDashboard, staffDashboard, memberDashboard };