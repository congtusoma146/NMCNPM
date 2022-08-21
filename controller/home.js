const router = require('express').Router();
const userM = require('../models/users');
const bookM = require('../models/book');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { user } = require('pg/lib/defaults');
const saltRounds = 10;
router.get('/', async (req, res) => {
    let user3 = await userM.getbyId(3);
    let user4 = await userM.getbyId(4);
    let user5 = await userM.getbyId(5);
    let userlogin = await userM.get(req.user);
    if (req.user) {
        res.render('home', {
            layout: 'index',
            cssP: () => 'css',
            scriptsP: () => 'scripts',
            navP: () => 'navlogin',
            footerP: () => 'footer',
            username: req.user,
            namelogin: userlogin.f_name,
            name3: user3.f_name,
            dob3: user3.f_dob,
            hobby3: user3.f_hobby,
            job3: user3.f_job,
            avatar3: user3.f_avatar,
            status3: user3.f_status,
            name4: user4.f_name,
            dob4: user4.f_dob,
            hobby4: user4.f_hobby,
            job4: user4.f_job,
            avatar4: user4.f_avatar,
            status4: user4.f_status,
            name5: user5.f_name,
            dob5: user5.f_dob,
            hobby5: user5.f_hobby,
            job5: user5.f_job,
            status5: user5.f_status,
            avatar5: user5.f_avatar

        })
    }
    res.render('home', {
        layout: 'index',
        cssP: () => 'css',
        scriptsP: () => 'scripts',
        navP: () => 'nav',
        footerP: () => 'footer',
        name3: user3.f_name,
        dob3: user3.f_dob,
        hobby3: user3.f_hobby,
        job3: user3.f_job,
        avatar3: user3.f_avatar,
        status3: user3.f_status,
        name4: user4.f_name,
        dob4: user4.f_dob,
        hobby4: user4.f_hobby,
        job4: user4.f_job,
        avatar4: user4.f_avatar,
        status4: user4.f_status,
        name5: user5.f_name,
        dob5: user5.f_dob,
        hobby5: user5.f_hobby,
        job5: user5.f_job,
        status5: user5.f_status,
        avatar5: user5.f_avatar
    })
});

router.get('/signin', async (req, res) => {
    /* if (req.cookies.un) {
        res.redirect('/');
        return;
    } */
    if (req.user) {
        console.log("login with user: ");
        res.render('home', {
            msg: 'logged in',
            color: 'success',
        });
        res.redirect('/');
        return;
    }
    res.render('signin', {
        navP: () => 'navSignin'
    })
});


router.get('/signup', (req, res) => {
    res.render('signup', {
        navP: () => 'navSignup'
    })
});

router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const pwd = req.body.pwd;
    const name = req.body.name;

    let user = await userM.get(username);
    if (user) {
        res.redirect('./signin');
        return;
    }
    const pwdHashed = await bcrypt.hash(pwd, saltRounds)
    user = {
        f_username: username,
        f_password: pwdHashed,
        f_name: name,
        f_dob: req.body.dob,
        f_hobby: req.body.hobby,
        f_job: req.body.job,
        f_option: req.body.option,
        f_avatar: req.body.avatar
    };
    const rs = await userM.add(user);
    console.log(rs);
    res.redirect('./signin');
});

router.get('/signout', (req, res) => {
    if (req.user) {
        req.logOut();
    }
    return res.redirect('/');
})

router.post('/signin', async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.render('signin', {
                navP: () => 'navSignin',
                msg: 'error',
                color: 'success'
            });
        }
        if (!user) {
            return res.render('signin', {
                navP: () => 'navSignin',
                msg: 'incorrect username',
                color: 'success'
            });
        }
        req.logIn(user, async function (err) {
            if (err) {
                return res.render('signin', {
                    navP: () => 'navSignin',
                    msg: 'error',
                    color: 'success'
                });
            }
            let fuser = await userM.get(user);
            if (fuser.f_status) {
                return res.render('personal', {
                    layout: 'index',
                    cssP: () => 'css',
                    scriptsP: () => 'scripts',
                    footerP: () => 'footer',
                    navP: () => 'navlogin',
                    username: fuser.f_username,
                    name: fuser.f_name,
                    namelogin: fuser.f_name,
                    dob: fuser.f_dob,
                    hobby: fuser.f_hobby,
                    job: fuser.f_job,
                    avatar: fuser.f_avatar,
                    status: fuser.f_status
                });
            }
            return res.render('personal', {
                layout: 'index',
                cssP: () => 'css',
                scriptsP: () => 'scripts',
                footerP: () => 'footer',
                navP: () => 'navlogin',
                username: fuser.f_name,
                namelogin: fuser.f_name,
                dob: fuser.f_dob,
                hobby: fuser.f_hobby,
                job: fuser.f_job,
                avatar: fuser.f_avatar,
                status: null
            });
        });
    })(req, res, next);

});

router.get('/info', (req, res) => {

    res.render('info', {
        layout: 'index',
        cssP: () => 'css',
        scriptsP: () => 'scripts',
        navP: () => 'empty',
        footerP: () => 'footer',
    })
});

router.post('/info', async (req, res) => {
    if (req.user) {
        let userlog = await userM.get(req.user);
        if (req.body.fid) {
            const id = parseInt(req.body.fid, 10);
            let user = await userM.getbyId(id);
            console.log('user');
            return res.render('info', {
                layout: 'index',
                cssP: () => 'css',
                scriptsP: () => 'scripts',
                navP: () => 'navlogin',
                footerP: () => 'footer',
                username: user.f_username,
                avatar: user.f_avatar,
                name: user.f_name,
                namelogin: userlog.f_name,
                dob: user.f_dob,
                hobby: user.f_hobby,
                status: user.f_status,
                price: user.f_price,
                job: user.f_job
            })
        }
        let user = await userM.get(req.body.username)
        if (req.body.username && (req.user == req.body.username)) {
            try {
                res.render('personal', {
                    layout: 'index',
                    cssP: () => 'css',
                    scriptsP: () => 'scripts',
                    navP: () => 'navlogin',
                    footerP: () => 'footer',
                    username: user.f_username,
                    avatar: user.f_avatar,
                    name: user.f_name,
                    namelogin: userlog.f_name,
                    dob: user.f_dob,
                    hobby: user.f_hobby,
                    status: user.f_status,
                    job: user.f_job
                })
            }
            catch (error) {
                return console.log('info error:', error);
            }
        }
        else {
            try {
                return res.render('info', {
                    layout: 'index',
                    cssP: () => 'css',
                    scriptsP: () => 'scripts',
                    navP: () => 'navlogin',
                    footerP: () => 'footer',
                    username: user.f_username,
                    avatar: user.f_avatar,
                    name: user.f_name,
                    namelogin: userlog.f_name,
                    dob: user.f_dob,
                    hobby: user.f_hobby,
                    status: user.f_status,
                    price: user.f_price,
                    job: user.f_job
                })
            }
            catch (error) {
                return console.log('error: ', error)
            }
        }

    }
    if (req.body.fid) {
        const id = parseInt(req.body.fid, 10);
        let user = await userM.getbyId(id);
        console.log('user');
        return res.render('info', {
            layout: 'index',
            cssP: () => 'css',
            scriptsP: () => 'scripts',
            navP: () => 'nav',
            footerP: () => 'footer',
            avatar: user.f_avatar,
            namelogin: user.f_name,
            dob: user.f_dob,
            hobby: user.f_hobby,
            status: user.f_status,
            price: user.f_price,
            job: user.f_job
        })
    }
    if (req.body.username) {
        let user = await userM.get(req.body.username)
        if (user) {
            res.render('info', {
                layout: 'index',
                cssP: () => 'css',
                scriptsP: () => 'scripts',
                navP: () => 'nav',
                footerP: () => 'footer',
                username: user.f_username,
                avatar: user.f_avatar,
                name: user.f_name,
                dob: user.f_dob,
                hobby: user.f_hobby,
                status: user.f_status,
                job: user.f_job,
                price: user.f_price
            })
        }
        else {
            res.redirect('/');
        }
    }
});

router.get('/personal', async (req, res) => {
    if (req.user) {
        let user = await userM.get(req.user)
        try {
            return res.render('personal', {
                layout: 'index',
                cssP: () => 'css',
                scriptsP: () => 'scripts',
                navP: () => 'navlogin',
                footerP: () => 'footer',
                username: user.f_username,
                avatar: user.f_avatar,
                namelogin: user.f_name,
                name: user.f_name,
                dob: user.f_dob,
                hobby: user.f_hobby,
                status: user.f_status,
                job: user.f_job
            })
        } catch (error) {
            console.log('get personal error: ', error);
        }
    }
    return res.redirect('/')
})

router.post('/personal', async (req, res) => {
    /* console.log("req.user: ",req.session.passport.user); */
    const username = req.body.username;
    let user = await userM.get(username);
    let fstatus = {
        f_status: req.body.status
    };
    user = await userM.update(fstatus, username);
    if (req.user) {

        try {
            res.render('personal', {
                layout: 'index',
                cssP: () => 'css',
                scriptsP: () => 'scripts',
                navP: () => 'navlogin',
                footerP: () => 'footer',
                username: user.f_username,
                avatar: user.f_avatar,
                namelogin: req.user,
                name: user.f_name,
                dob: user.f_dob,
                hobby: user.f_hobby,
                status: user.f_status,
                job: user.f_job
            })
        } catch (error) {
            console.log('post personal with user error: ', error);
        }
    }
    try {
        res.render('personal', {
            layout: 'index',
            cssP: () => 'css',
            scriptsP: () => 'scripts',
            navP: () => 'navlogin',
            footerP: () => 'footer',
            username: user.f_username,
            avatar: user.f_avatar,
            namelogin: user.f_name,
            dob: user.f_dob,
            hobby: user.f_hobby,
            status: user.f_status,
            job: user.f_job
        })
    } catch (error) {
        console.log('post personal error: ', error);
    }

})

router.get('/update', async (req, res) => {
    if (req.user) {
        try {
            let user = await userM.get(req.user);
            console.log("test: ", user.f_name);
            return res.render('update', {
                layout: 'index',
                cssP: () => 'css',
                scriptsP: () => 'scripts',
                navP: () => 'navlogin',
                footerP: () => 'footer',
                pwd: user.f_password,
                avatar: user.f_avatar,
                name: user.f_name,
                namelogin: user.f_name,
                dob: user.f_dob,
                hobby: user.f_hobby,
                status: user.f_status,
                job: user.f_job
            })
        } catch (error) {
            console.log('get update: ', console.error)
        }
    }
    return res.redirect('/');
})

router.post('/update', async (req, res) => {
    if (req.user) {
        let user = await userM.get(req.user)
        let fupdate;
        if (req.body.pwd) {
            const pwdHashed = await bcrypt.hash(req.body.pwd, saltRounds)
            fupdate = {
                f_password: pwdHashed,
                f_name: req.body.name,
                f_dob: req.body.dob,
                f_hobby: req.body.hobby,
                f_job: req.body.job,
                f_option: req.body.option,
                f_avatar: req.body.avatar
            }
        }
        else {
            fupdate = {
                f_name: req.body.name,
                f_dob: req.body.dob,
                f_hobby: req.body.hobby,
                f_job: req.body.job,
                f_option: req.body.option,
                f_avatar: req.body.avatar
            }
        }
        const username = req.user;
        user = await userM.update(fupdate, username);
        console.log(user);
        try {
            return res.render('update', {
                layout: 'index',
                cssP: () => 'css',
                scriptsP: () => 'scripts',
                navP: () => 'navlogin',
                footerP: () => 'footer',
                username: user.f_username,
                pwd: user.f_password,
                avatar: user.f_avatar,
                name: user.f_name,
                namelogin: user.f_name,
                dob: user.f_dob,
                hobby: user.f_hobby,
                status: user.f_status,
                job: user.f_job
            })
        } catch (error) {
            console.log('post update: ', error)
        }
    }
    return res.redirect('/personal');
})

router.get('/book', async (req, res) => {
    try {
        return res.render('book', {
            layout: 'index',
            cssP: () => 'css',
            scriptsP: () => 'scripts',
            navP: () => 'nav',
            footerP: () => 'footer',
            avatar: user.f_avatar,
            name: user.f_name,
            dob: user.f_dob,
            hobby: user.f_hobby,
            job: user.f_job
        })
    } catch (error) {
        console.log('get book: ', error)
    }
})


router.post('/book', async (req, res) => {
    let user = await userM.get(req.body.username);
    let userlog = await userM.get(req.user);
    if (!user) {
        return res.redirect('/signin');
    }
    
    if (req.user == undefined) {
        if (user.f_option == 1) {
            try {
                return res.render('info', {
                    layout: 'index',
                    cssP: () => 'css',
                    scriptsP: () => 'scripts',
                    navP: () => 'nav',
                    footerP: () => 'footer',
                    username: user.f_username,
                    avatar: user.f_avatar,
                    name: user.f_name,
                    //namelogin: userlog.f_name,
                    dob: user.f_dob,
                    hobby: user.f_hobby,
                    status: user.f_status,
                    price: user.f_price,
                    job: user.f_job
                })
            }
            catch (error) {
                return console.log('info error:', error);
            }
        }
        try {
            return res.render('book', {
                layout: 'index',
                cssP: () => 'css',
                scriptsP: () => 'scripts',
                navP: () => 'nav',
                footerP: () => 'footer',
                username: user.f_username,
                avatar: user.f_avatar,
                name: user.f_name,
                dob: user.f_dob,
                hobby: user.f_hobby,
                msg: 'Bạn chưa đăng nhập',
                price: user.f_price,
                job: user.f_job
            })
        } catch (error) {
            console.log('post book without user: ', error)
        }
    }
    if (userlog.f_username == user.f_username) {
        try {
            return res.render('personal', {
                layout: 'index',
                cssP: () => 'css',
                scriptsP: () => 'scripts',
                navP: () => 'navlogin',
                footerP: () => 'footer',
                namelogin: userlog.f_name,
                username: user.f_username,
                avatar: user.f_avatar,
                name: user.f_name,
                dob: user.f_dob,
                hobby: user.f_hobby,
                job: user.f_job
            })
        } catch (error) {
            console.log('post book with the same user : ', error)
        }
    }
    else {
        if (user.f_option == 1) {
            try {
                return res.render('info', {
                    layout: 'index',
                    cssP: () => 'css',
                    scriptsP: () => 'scripts',
                    navP: () => 'navlogin',
                    footerP: () => 'footer',
                    username: user.f_username,
                    avatar: user.f_avatar,
                    name: user.f_name,
                    namelogin: userlog.f_name,
                    dob: user.f_dob,
                    hobby: user.f_hobby,
                    status: user.f_status,
                    price: user.f_price,
                    job: user.f_job
                })
            }
            catch (error) {
                return console.log('info error:', error);
            }
        }
        if (req.body.ngay == undefined) {
            try {
                return res.render('book', {
                    layout: 'index',
                    cssP: () => 'css',
                    scriptsP: () => 'scripts',
                    navP: () => 'navlogin',
                    footerP: () => 'footer',
                    namelogin: userlog.f_name,
                    username: user.f_username,
                    avatar: user.f_avatar,
                    name: user.f_name,
                    dob: user.f_dob,
                    hobby: user.f_hobby,
                    price: user.f_price,
                    job: user.f_job
                })
            } catch (error) {
                console.log('post book with user but without book : ', error)
            }
        }
        else {
            let d = parseInt(req.body.ngay, 10);
            let m = parseInt(req.body.thang, 10);
            let y = parseInt(req.body.nam, 10);
            let date = new Date(y, m - 1, d);
            let day = req.body.ngay + '/' + req.body.thang + '/' + req.body.nam;
            if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
                let book = await bookM.get(userlog.f_username);
                book = {
                    f_username: userlog.f_username,
                    f_user: user.f_username,
                    f_date: day,
                    f_note: req.body.note
                };
                let books = new Array();
                let index = 0;
                for (index; index < 1000; index++) {
                    books[index] = await bookM.getbyId(index + 1);
                }
                let i = 1;
                while (i < index && books[i] != null) {
                    if ((books[i].f_username == book.f_username) && (books[i].f_date == book.f_date)) {
                        try {
                            return res.render('book', {
                                layout: 'index',
                                cssP: () => 'css',
                                scriptsP: () => 'scripts',
                                navP: () => 'navlogin',
                                footerP: () => 'footer',
                                username: user.f_username,
                                namelogin: userlog.f_name,
                                avatar: user.f_avatar,
                                name: user.f_name,
                                dob: user.f_dob,
                                hobby: user.f_hobby,
                                job: user.f_job,
                                price: user.f_price,
                                msg: 'Đặt lịch thất bại'
                            })
                        } catch (error) {
                            console.log('post book with user but failed : ', error)
                        }
                    }
                    i = i + 1;
                }
                const rs = await bookM.add(book);
                try {
                    return res.render('book', {
                        layout: 'index',
                        cssP: () => 'css',
                        scriptsP: () => 'scripts',
                        navP: () => 'navlogin',
                        footerP: () => 'footer',
                        username: user.f_username,
                        namelogin: userlog.f_name,
                        avatar: user.f_avatar,
                        name: user.f_name,
                        dob: user.f_dob,
                        hobby: user.f_hobby,
                        job: user.f_job,
                        price: user.f_price,
                        msg: 'Đặt lịch thành công'
                    })
                } catch (error) {
                    console.log('post book with user but success : ', error)
                }
            }
            else {
                try {
                    return res.render('book', {
                        layout: 'index',
                        cssP: () => 'css',
                        scriptsP: () => 'scripts',
                        navP: () => 'navlogin',
                        footerP: () => 'footer',
                        namelogin: userlog.f_name,
                        username: user.f_username,
                        avatar: user.f_avatar,
                        name: user.f_name,
                        dob: user.f_dob,
                        hobby: user.f_hobby,
                        job: user.f_job,
                        price: user.f_price,
                        msg: 'Đặt lịch thất bại do nhập sai ngày'
                    })
                } catch (error) {
                    console.log('post book with the wrong day: ', error)
                }
            }
        }
    }
})

router.get('/about', (req, res) => {
    return res.render('about', {
        layout: 'index',
        cssP: () => 'css',
        scriptsP: () => 'scripts',
        navP: () => 'navabout',
        footerP: () => 'footer',
    })
})
module.exports = router;