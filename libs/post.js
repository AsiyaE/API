module.exports = app => {
	const fs = require('fs');
	const file = './libs/data.json';

	app
	.use((req, res, next) => {
		fs.readFile(file, (err, data) => {
			if (err){
				console.log(err);
				return res
					.status(500)
					.send({ message: 'Error while getting promo',
					'error': err});
			}
			req.promo  = JSON.parse(data);
			next();
		});
	});
	app
	.route('/promo')
	.post((req, res) => {
		if (req.body){

			if(req.promo.length>0){ 
				const sameElem = req.promo.filter(item =>(item.name == req.body.name));
				if (sameElem.length!=0){
					return res
						.status(409)
						.send({ message: 'Promo already exists.' })
				}
				const lastPosition = req.promo[req.promo.length-1];
				const nextID = req.promo[lastPosition].id+1;
				req.promo.push(req.body);
				req.promo[lastPosition+1].id = nextID;
			}
			else{
				req.promo.push(req.body);
				req.promo[0].id = 1;
			}
			
			fs.writeFile(
				file,
				JSON.stringify(req.promo),
				(err, response) => {
					if (err)
					return res
						.status(500)
						.send({ message: 'Unable to add promo.' })
		
					return res
						.status(201)
						.send({ message: 'Promo added.' })
				}
			)
		}else
			return res
				.status(400)
				.send({ message: 'Bad request.' })
	})
}