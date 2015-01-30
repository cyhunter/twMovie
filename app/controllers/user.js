// user signUp
var User = require('../models/user.js');
exports.signup = function(req, res) {
	var _user = req.body.user;
	User.find({
		name: _user.name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user.name == "") {
			res.redirect('/');
		} else {
			var user = new User(_user);
			user.save(function(err, user) {
				if (err) {
					console.log(err);
				}
				console.log('reg is ok');
				res.redirect('/admin/userlist');
			});
		}
	});

};

//user list page
exports.userlist = function(req, res) {
	User.fetch(function(err, users) {
		if (err) {
			console.log(err);
		}
		res.render('userlist', {
			title: "twMovie用户列表",
			users: users
		});
	});

};

//user login
exports.signin = function(req, res) {
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({
		name: name
	}, function(err, user) {
		if (err) {
			console.log(err);
		}
		console.log(user);
		if (user == null) {
			console.log('the user name is not reg');
			return res.redirect('/signin');
		}
		user.comparePassword(password, function(isMatch) {
			if (isMatch) {
				req.session.user = user;
				return res.redirect('/');
			} else {
				console.log('the password is not macth');
				return res.redirect('/signin');
			}
		})
	})
};

//user logout
exports.logout = function(req, res) {
	delete req.session.user;
	//delete app.locals.user;
	res.redirect('/')
};


//show signin
exports.showSignin = function(req, res) {
	res.render('signin', {
		title: '用户登录'
	})
};
//show signup
exports.showSignup = function(req, res) {
	res.render('signup', {
		title: '用户注册'
	})
};


//usersignRequire
exports.signinRequire = function(req, res, next	) {
	var user = req.session.user;
	if (!user) {
		return res.redirect('/signin');
	}
	next();
};

//user adminRequire
exports.adminRequire = function(req, res, next) {
	var user = req.session.user;
	if (user.role <= 10) {
		return res.redirect('/signin');
	}
	next();
};