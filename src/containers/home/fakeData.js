export default FakeData = {
    user: {
        name: 'Ellie',
        avatar: 'https://sohanews.sohacdn.com/160588918557773824/2021/4/1/photo-1-16172667770152075485278.jpg',
        phone: '+840328400441',
        day_of_birth: '19/05/1990',
        avatar: 'https://kenh14cdn.com/thumb_w/660/2019/1/16/hoatran-7224-1547656903304112276009.jpg',
    },

    newfeed: [
        {
            id: 1,
            user: {
                name: 'Steve Lee',
                phone: '+840328400441',
                day_of_birth: '19/05/1990',
                avatar: 'https://kenh14cdn.com/thumb_w/660/2019/1/16/hoatran-7224-1547656903304112276009.jpg',
            },
            content: 'go far away to come back',
            resource: [
                {
                    url: 'https://sfexpress.vn/wp-content/uploads/2021/05/trung-tam-thanh-pho-ha-noi-603da1f235b38.jpg',
                    type: 'images',
                },
                {
                    url: 'https://iv.vnecdn.net/dulich/images/web/2020/11/23/la-c-lo--i-giu--a-thie-n-du-o--ng-bie--n-da-o-phu--quo--c-1606113007.jpg',
                    type: 'images',
                },
                {
                    url: 'https://img5.thuthuatphanmem.vn/uploads/2021/09/19/hinh-anh-dao-phu-quoc-nhin-tu-cap-treo_095340233.jpg',
                    type: 'images',
                },
            ],
            numOfLike: 12000,
            numOfComment: 4500,
            createdAt: '2021-11-06 04:34:04',
        },
        {
            id: 1,
            user: {
                name: 'Steve Lee',
                phone: '+840328400441',
                day_of_birth: '19/05/1990',
                avatar: 'https://kenh14cdn.com/thumb_w/660/2019/1/16/hoatran-7224-1547656903304112276009.jpg',
            },
            content: 'go far away to come back',
            resource: [
                {
                    url: 'https://sfexpress.vn/wp-content/uploads/2021/05/trung-tam-thanh-pho-ha-noi-603da1f235b38.jpg',
                    type: 'images',
                },
            ],
            numOfLike: 12000,
            numOfComment: 4500,
            createdAt: '2021-11-06 04:34:04',
        },
        {
            id: 1,
            user: {
                name: 'Steve Lee',
                phone: '+840328400441',
                day_of_birth: '19/05/1990',
                avatar: 'https://kenh14cdn.com/thumb_w/660/2019/1/16/hoatran-7224-1547656903304112276009.jpg',
            },
            content: 'go far away to come back',
            resource: [
                {
                    url: 'https://sfexpress.vn/wp-content/uploads/2021/05/trung-tam-thanh-pho-ha-noi-603da1f235b38.jpg',
                    type: 'images',
                },
            ],
            numOfLike: 12000,
            numOfComment: 4500,
            createdAt: '2021-11-06 04:34:04',
        },
        {
            id: 1,
            user: {
                name: 'Steve Lee',
                phone: '+840328400441',
                day_of_birth: '19/05/1990',
                avatar: 'https://kenh14cdn.com/thumb_w/660/2019/1/16/hoatran-7224-1547656903304112276009.jpg',
            },
            content: 'go far away to come back',
            resource: [
                {
                    url: 'https://sfexpress.vn/wp-content/uploads/2021/05/trung-tam-thanh-pho-ha-noi-603da1f235b38.jpg',
                    type: 'images',
                },
            ],
            numOfLike: 12000,
            numOfComment: 4500,
            createdAt: '2021-11-06 04:34:04',
        },
    ],
    comment: [
        {
            user: {
                id: 1,
                name: 'Tony',
                avatar: 'https://cdn.voh.com.vn/voh/Image/2018/12/20/1448217616181528584893166970954203145437184n_20181220144508.jpg',
            },
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            created_at: '2021-11-06 04:34:04',
        },
        {
            user: {
                id: 1,
                name: 'Tony',
                avatar: 'https://cdn.voh.com.vn/voh/Image/2018/12/20/1448217616181528584893166970954203145437184n_20181220144508.jpg',
            },
            content: 'Lorem ipsum dolor sit amet',
            created_at: '2021-11-07 04:34:04',
        },
        {
            user: {
                id: 1,
                name: 'Tony',
                avatar: '',
            },
            created_at: '2021-11-07 14:34:04',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
            childs: [
                {
                    user: {
                        id: 1,
                        name: 'Tony',
                        avatar: 'https://cdn.voh.com.vn/voh/Image/2018/12/20/1448217616181528584893166970954203145437184n_20181220144508.jpg',
                    },
                    content: 'Lorem ',
                    parent_id: 1,
                    created_at: '2021-11-08 04:34:04',
                },
                {
                    user: {
                        id: 1,
                        name: 'Tony',
                        avatar: 'https://cdn.voh.com.vn/voh/Image/2018/12/20/1448217616181528584893166970954203145437184n_20181220144508.jpg',
                    },
                    content: 'Lorem ipsum dolor sit ',
                    parent_id: 1,
                    created_at: '2021-11-08 07:00:00',
                },
                {
                    user: {
                        id: 1,
                        name: 'Tony',
                        avatar: '',
                    },
                    parent_id: 1,
                    content:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    created_at: '2021-11-08 07:10:00',
                },
                {
                    user: {
                        id: 1,
                        name: 'Tony',
                        avatar: 'https://cdn.voh.com.vn/voh/Image/2018/12/20/1448217616181528584893166970954203145437184n_20181220144508.jpg',
                    },
                    parent_id: 1,
                    content:
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
                    created_at: '2021-11-08 07:35:00',
                },
            ],
        },
    ],
};
