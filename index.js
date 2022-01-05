const express = require('express');
const Category = require('./db/models/Category');
const bodyParser = require('body-parser');
const cors = require('cors');
const Record = require('./db/models/Record');
const User = require('./db/models/User');
const NewsRecord = require('./db/models/NewsRecord');
const Log = require('./db/models/Log');
const SubCategory = require('./db/models/SubCategory');
const asyncmodule = require('async')
require('./db')

// functions
function convertToSlug(str) {
    str = str.toLowerCase();
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

// Roles
const DELETE_ONLY = 'Delete'
const ADD_ONLY = 'Add'
const EDIT_ONLY = 'Edit'
const ALL_ACCESS = 'All Access'

async function givePermissonOnBasisOfRole(userId, role) {
    const res = new Promise((resolve, reject) => {
        User.findById(userId, (err, user) => {
            if (err) {
                reject(err)
            } else {
                if (user.roles.includes(role) || user.roles.includes(ALL_ACCESS)) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        })
    })
    return res
}

// App config
const app = express();
app.use(express.json({ limit: '20000000mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '20000000mb' }));
app.use(cors());

app.use('/ping', (req, res) => {
    res.json({
        msg: 'success',
        time: new Date().toLocaleString(),
    })
})

// CATEGORIES

app.use('/api/categories', (req, res) => {
    // fetch all categories
    console.log('fetch all categories')

    Category.find(req.query, (err, categories) => {
        if (err) {
            res.status(500).json({
                msg: 'error fetching categories',
                error: err
            })
        } else {
            res.json(categories)
        }
    }
    )

})

app.use('/api/add-category', async (req, res) => {
    // add category
    const {
        name,
    } = req.body;
    const category = new Category({
        name: name,
        slug: convertToSlug(name),
        date: new Date().toLocaleString(),
    })
    category.save((err, category) => {
        if (err) {
            res.status(500).json({
                msg: 'error saving category',
                error: err
            })
        } else {
            res.json(category)
            const log = new Log({
                user: "Super User",
                action: "Added Category -> Id -> " + category._id,
                datetime: new Date().toLocaleString(),
            })
            log.save((err, log) => {
                if (err) {
                    console.log(err)
                }
            }
            )
        }
    })
})

app.use('/api/update-category', async (req, res) => {
    // update category
    const {
        id,
        name,
    } = req.body;

    const payload = {
        name: name,
        slug: convertToSlug(name),
    }

    Category.findByIdAndUpdate(id, payload, (err, category) => {
        if (err) {
            res.status(500).json({
                msg: 'error updating category',
                error: err
            })
        } else {
            res.json(category)
            const log = new Log({
                user: "Super User",
                action: "Updated Category -> Id -> " + category._id,
                datetime: new Date().toLocaleString(),
            })
            log.save((err, log) => {
                if (err) {
                    console.log(err)
                }
            }
            )
        }
    }
    )
})

app.use('/api/delete-category', async (req, res) => {
    // delete category
    const categoryId = req.body.id;

    Category.findByIdAndDelete(categoryId, (err, category) => {
        if (err) {
            res.status(500).json({
                msg: 'error deleting category',
                error: err
            })
        } else {
            res.json(category)

            const log = new Log({
                user: "Super User",
                action: "Deleted Category -> Id -> " + category._id,
                datetime: new Date().toLocaleString(),
            })
            log.save((err, log) => {
                if (err) {
                    console.log(err)
                }
            }
            )
        }
    })
})


// SUB - CATEGORIES

app.use('/api/sub-categories', (req, res) => {
    SubCategory.find(req.query, (err, categories) => {
        if (err) {
            res.status(500).json({
                msg: 'error fetching categories',
                error: err
            })
        } else {
            res.json(categories)
        }
    }
    )

})

app.use('/api/add-sub-category', async (req, res) => {
    // add category
    const {
        name,
    } = req.body;
    const subcategory_save = new SubCategory({
        name: name,
        slug: convertToSlug(name),
        date: new Date().toLocaleString(),
    })
    subcategory_save.save((err, category) => {
        if (err) {
            res.status(500).json({
                msg: 'error saving category',
                error: err
            })
        } else {
            res.json(category)
            const log = new Log({
                user: "Super User",
                action: "Added Sub Category -> Id -> " + category._id,
                datetime: new Date().toLocaleString(),
            })
            log.save((err, log) => {
                if (err) {
                    console.log(err)
                }
            }
            )
        }
    })
})

app.use('/api/update-sub-category', async (req, res) => {
    // update category
    const {
        id,
        name,
    } = req.body;

    const payload = {
        name: name,
        slug: convertToSlug(name),
    }

    SubCategory.findByIdAndUpdate(id, payload, (err, category) => {
        if (err) {
            res.status(500).json({
                msg: 'error updating category',
                error: err
            })
        } else {
            res.json(category)
            const log = new Log({
                user: "Super User",
                action: "Updated Sub Category -> Id -> " + category._id,
                datetime: new Date().toLocaleString(),
            })
            log.save((err, log) => {
                if (err) {
                    console.log(err)
                }
            }
            )
        }
    }
    )
})

app.use('/api/delete-sub-category', async (req, res) => {
    // delete category
    const categoryId = req.body.id;

    SubCategory.findByIdAndDelete(categoryId, (err, category) => {
        if (err) {
            res.status(500).json({
                msg: 'error deleting category',
                error: err
            })
        } else {
            res.json(category)

            const log = new Log({
                user: "Super User",
                action: "Deleted Sub Category -> Id -> " + category._id,
                datetime: new Date().toLocaleString(),
            })
            log.save((err, log) => {
                if (err) {
                    console.log(err)
                }
            }
            )
        }
    })
})



// RECORDS

app.use('/api/records', (req, res) => {
    // fetch all records
    console.log('fetch all records')
    if (req.query.categoryId) {
        Record.find({
            categoryIds: {
                $in: [req.query.categoryId]
            }
        }, (err, records) => {
            if (err) {
                res.status(500).json({
                    msg: 'error fetching records',
                    error: err
                })
            } else {
                res.json(records)
            }
        }
        )
    } else {
        Record.find(req.query, (err, records) => {
            if (err) {
                res.status(500).json({
                    msg: 'error fetching records',
                    error: err
                })
            } else {
                res.json(records)
            }
        }
        )
    }
    
})

const record_with_categoryId = [
    {"name": "admitcard", "categoryId": "61c7fcc88b071fa93f007479", "limit": 15},
    {"name": "answerkey", "categoryId": "61c7fcd58b071fa93f00747d", "limit": 7},
    {"name": "important", "categoryId": "61c7fce38b071fa93f007481", "limit": 7},
    {"name": "job", "categoryId": "61c7fccb8b071fa93f00747b", "limit": 33},
    {"name": "result", "categoryId": "61c7fcc58b071fa93f007477", "limit": 18},
    {"name": "syllabus", "categoryId": "61c7fcdd8b071fa93f00747f", "limit": 7},
    {"name": "verification", "categoryId": "61c7fce58b071fa93f007483", "limit": 7},
]

app.use('/api/home-records', (req, res) => {
    // fetch all records
    console.log('fetch all records')
    const final = {}
    asyncmodule.each(record_with_categoryId, async (i, callback) => {
        const categoryIdOfRecord = i.categoryId
        let fetchedRecords = await Record.find({
            categoryIds: {
                $in: [i.categoryId]
            }
        }).limit(i.limit).exec()
        // log thee length of fetch records
        final[categoryIdOfRecord] = fetchedRecords
    }, function(err) {
        if(err) {
          console.log('A element failed to process', err)
          res.status(500).json(err)
        } else {
          console.log('All elements have been processed successfully')
          // array with the results of each removeTodo job
          res.status(200).json(final) 
        }
    })

    })

app.use('/api/add-record', async (req, res) => {
    // add record
    const {
        name,
        userId,
        post_display_name,
        subCategoryId,
        categoryIds,
        shortInfo,
        more_data_html,
        last_date
    } = req.body;

    console.log('add record')

    if (await givePermissonOnBasisOfRole(userId, ADD_ONLY)) {
        const record = new Record({
            name: name,
            active: true,
            post_display_name: post_display_name,
            created_at: new Date().toLocaleString(),
            slug: convertToSlug(name),
            subCategory: subCategoryId,
            categoryIds: categoryIds,
            short_information: shortInfo,
            last_date: last_date,
            updated_at: null,
            more_data_html: more_data_html
        })
        record.save((err, record) => {
            if (err) {
                res.status(500).json({
                    msg: 'error saving record',
                    error: err
                })
            } else {
                res.json(record)
                User.findById(userId, (err, user) => {
                    if (err) {
                        console.log(err)
                    } else {

                        const log = new Log({
                            user: user.name,
                            action: "Added Post -> Id -> " + record._id,
                            datetime: new Date().toLocaleString(),
                        })
                        log.save((err, log) => {
                            if (err) {
                                console.log(err)
                            }
                        }
                        )
                    }
                })
            }
        })
    } else {
        res.json({
            msg: 'unauthorized',
            status: 401
        })
    }
})


app.use('/api/delete-record', async (req, res) => {
    // delete record
    const recordId = req.body.id;
    const userId = req.body.userId;

    if (await givePermissonOnBasisOfRole(userId, DELETE_ONLY)) {
        console.log('delete record')
        Record.findByIdAndDelete(recordId, (err, record) => {
            if (err) {
                res.status(500).json({
                    msg: 'error deleting record',
                    error: err
                })
            } else {
                res.json({ status: 200 })
                User.findById(userId, (err, user) => {
                    if (err) {
                        console.log(err)
                    } else {

                        const log = new Log({
                            user: user.name,
                            action: "Deleted Post -> Id -> " + record._id,
                            datetime: new Date().toLocaleString(),
                        })
                        log.save((err, log) => {
                            if (err) {
                                console.log(err)
                            }
                        }
                        )
                    }
                })
            }
        })
    } else {
        res.json({
            msg: 'unauthorized',
            status: 401
        })
    }
})

app.use('/api/update-record', async (req, res) => {
    // update record
    const recordId = req.body.id;
    const {
        name,
        userId,
        post_display_name,
        subCategoryId,
        categoryIds,
        shortInfo,
        last_date,
        update_date,
        more_data_html
    } = req.body;

    if (await givePermissonOnBasisOfRole(userId, EDIT_ONLY)) {
        console.log('update record')
        Record.findByIdAndUpdate(recordId, {
            name: name,
            post_display_name: post_display_name,
            slug: convertToSlug(name),
            categoryIds: categoryIds,
            subCategory: subCategoryId,
            short_information: shortInfo,
            last_date: last_date,
            updated_at: update_date,
            more_data_html: more_data_html

        }, async (err, record) => {
            if (err) {
                res.status(500).json({
                    msg: 'error updating record',
                    error: err
                })
            } else {
                res.json(record)
                User.findById(userId, (err, user) => {
                    if (err) {
                        console.log(err)
                    } else {

                        const log = new Log({
                            user: user.name,
                            action: "Updated Post -> Id -> " + record._id,
                            datetime: new Date().toLocaleString(),
                        })
                        log.save((err, log) => {
                            if (err) {
                                console.log(err)
                            }
                        }
                        )
                    }
                })
            }
        }
        )
    } else {
        res.json({
            msg: 'unauthorized',
            status: 401
        })
    }
})

// fetch news records
app.use("/api/news-records", (req, res) => {
    console.log('fetch news records');
    NewsRecord.find(req.query, (err, newsRecord) => {
        if (err) {
            res.status(500).json({
                msg: 'error fetching news records',
                error: err
            })
        } else {
            res.json(newsRecord)
        }
    })
})

app.use('/api/update-news-record', async (req, res) => {
    // update category
    console.log("update news record")
    const {
        id,
        name,
        fillColor,
        recordId,
    } = req.body;

    const payload = {
        name: name,
        recordId: recordId,
        fillColor: fillColor
    }

    NewsRecord.findByIdAndUpdate(id, payload, (err, newsrecord) => {
        if (err) {
            res.status(500).json({
                msg: 'error updating news record',
                error: err
            })
        } else {
            res.json(newsrecord)
            const log = new Log({
                user: "Super User",
                action: "Updated NewsRecord -> Id -> " + newsrecord._id,
                datetime: new Date().toLocaleString(),
            })
            log.save((err, log) => {
                if (err) {
                    console.log(err)
                }
            }
            )
        }
    }
    )
})


// add news records
app.use('/api/add-news-records', (req, res) => {
    const { name, recordId, fillColor } = req.body;

    const newsRecord = new NewsRecord({
        name: name,
        recordId: recordId,
        fillColor: fillColor,
        datetime: new Date().toLocaleString()
    })

    newsRecord.save((err, newsRecord) => {
        if (err) {
            res.status(500).json({
                msg: 'error saving news record',
                error: err
            })
        } else {
            res.json(newsRecord)
            const log = new Log({
                user: "Super User",
                action: "Post added to news -> Post Id -> " + newsRecord._id,
                datetime: new Date().toLocaleString(),
            })
            log.save((err, log) => {
                if (err) {
                    console.log(err)
                }
            }
            )
        }
    }
    )
})

// delete news records
app.use('/api/delete-news-records', (req, res) => {
    const { id } = req.body;
    NewsRecord.findByIdAndDelete(id, (err, newsRecord) => {
        if (err) {
            res.status(500).json({
                msg: 'error deleting news record',
                error: err
            })
        } else {
            res.json(newsRecord)
            const log = new Log({
                user: "Super User",
                action: "Deleted News Post -> Post Id -> " + newsRecord._id,
                datetime: new Date().toLocaleString(),
            })
            log.save((err, log) => {
                if (err) {
                    console.log(err)
                }
            }
            )
        }
    }
    )
})

// update news records
// app.use('/api/news-records/update', (req, res) => {
//     const { id, name, recordId } = req.body;
//     NewsRecord.findByIdAndUpdate(id, {
//         name: name,
//         recordId: recordId
//     }, (err, newsRecord) => {
//         if (err) {
//             res.status(500).json({
//                 msg: 'error updating news record',
//                 error: err
//             })
//         } else {
//             res.json(newsRecord)
//             const log = new Log({
//                 user: "Super user",
//                 action: "Updated news post -> Post Id -> " + newsRecord._id,
//                 datetime: new Date().toLocaleString(),
//             })
//             log.save((err, log) => {
//                 if (err) {
//                     console.log(err)
//                 }
//             }
//             )
//         }
//     }
//     )
// })


// Login 
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    User.findOne({ name: username }, (err, user) => {
        if (user) {
            if (password === user.password) {
                res.send({ message: "login success", user: user, success: true })
                const log = new Log({
                    user: username,
                    action: "User logged in",
                    datetime: new Date().toLocaleString(),
                })
                log.save((err, log) => {
                    if (err) {
                        console.log(err)
                    }
                }
                )
            } else {
                res.send({ message: "wrong credentials", success: false })
            }
        } else {
            res.send({ message: "user not registered", success: false })
        }
    })
});


// Add User
app.post("/api/user/add", (req, res) => {
    const { name, email, password, roles } = req.body;
    const user = new User({
        name: name,
        email: email,
        password: password,
        roles: roles,
        datetime: new Date().toLocaleString()
    })
    user.save((err, user) => {
        if (err) {
            res.status(500).json({
                msg: 'error saving user',
                error: err
            })
        } else {
            res.json(user)
        }
    })
});

// edit user
app.post("/api/user/edit", (req, res) => {
    const { id, name, email, password, roles } = req.body;
    User.findByIdAndUpdate(id, {
        name: name,
        email: email,
        password: password,
        roles: roles,
        datetime: new Date().toLocaleString()
    }, (err, user) => {
        if (err) {
            res.status(500).json({
                msg: 'error updating user',
                error: err
            })
        } else {
            res.json(user)
        }
    })
});

// check user existance with id
app.post("/api/user/check", (req, res) => {
    console.log('user check');
    const { id } = req.body;
    User.findById(id, (err, user) => {
        if (err) {
            res.json({ exists: false })
        } else {
            res.json({ exists: true })
        }
    })
});


// get all users
app.get("/api/users", (req, res) => {
    User.find(req.query, (err, users) => {
        if (err) {
            res.status(500).json({
                msg: 'error fetching users',
                error: err
            })
        } else {
            res.json(users)
        }
    })
});

// delete user
app.post("/api/user/delete", (req, res) => {
    const { id } = req.body;
    User.findByIdAndDelete(id, (err, user) => {
        if (err) {
            res.status(500).json({
                msg: 'error deleting user',
                error: err
            })
        } else {
            res.json(user)
        }
    })
});

app.get('/api/logs', (req, res) => {
    Log.find(req.query, (err, logs) => {
        if (err) {
            res.status(500).json({
                msg: 'error fetching logs',
                error: err
            })
        } else {
            res.json(logs)
        }
    })
})

app.use('/api/bulk-records', async (req, res) => {
    // add record
    const {
        records,
        } = req.body;
    console.log('add record')
        Record.insertMany(records, (err, records) => {
            if (err) {
                res.status(500).json({
                    msg: 'error saving records',
                    error: err
                })
            } else {
                res.json(records)
            }
        }
        )
    })



SERVER_PORT = process.env.PORT || 4000;
// Starting the app
app.listen(SERVER_PORT, function () {
    console.log("Server is listening at port:" + SERVER_PORT);
});