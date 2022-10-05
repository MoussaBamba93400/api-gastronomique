const Sauces = require('../models/sauces');

exports.getAllSauces = (req, res, next) => {
    Sauces.find().then(
        (sauces) => {
            res.status(200).json(sauces)
        }
    ).catch(
        (error) => {
            res.status(400).json({ 
                error : error 
            })
        }
    )
}

exports.getOneSauces = (req, res, next) => {
    Sauces.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {res.status(200).json(sauce)
        }).catch(error => {
            res.status(404).json({
                error : error
            });
        });
}


exports.createSauce  = (req, res, next) => {
    
    console.log(req)
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id
   const sauce = new Sauces({
    ...sauceObject,
    likes: 0,
    dislikes:0,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   })
    console.log(sauce)
   sauce.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
}

exports.modifySauce = (req, res, next) => {
    

    Sauces.findOne({_id: req.params.id})
    .then(Sauce => {

        const sauce = new Sauces({
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            mainPepper: req.body.mainPepper,
            description: req.body.description,
            imageUrl:  req.body.imageUrl,
            heat: req.body.heat,
            userId: req.body.userId,
            usersLiked: Sauce.usersLiked,
            usersDisliked: Sauce.usersDisliked
          });
          Sauces.updateOne({_id: req.params.id}, sauce).then(
            () => {
              res.status(201).json({
                message: 'Sauce updated successfully!'
              });
            }
          ).catch(
            (error) => {
              res.status(400).json({
                error: error
              });
            }
          );
    })
    .catch(error => console.log(error))

    
    
  };

  exports.deleteSauce = (req, res, next) => {
    Sauces.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json({message: 'Sauce supprimé!'}))
    .catch( error => res.status(500).json({ error }))
  };



  exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            // nouvelles valeurs à modifier
            const newValues =  {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 1,
                dislikes: 0
            }
            // Différents cas:
            switch (like) {
                case 1:  // CAS: sauce liked
                    newValues.usersLiked.push(userId);
                    break;
                case -1:  // CAS: sauce disliked
                    newValues.usersDisliked.push(userId);
                    break;
                case 0:  // CAS: Annulation du like/dislike
                    if (newValues.usersLiked.includes(userId)) {
                        // si on annule le like
                        const index = newValues.usersLiked.indexOf(userId);
                        newValues.usersLiked.splice(index, 1);
                    } else {
                        // si on annule le dislike
                        const index = newValues.usersDisliked.indexOf(userId);
                        newValues.usersDisliked.splice(index, 1);
                    }
                    break;
            };
            // Calcul du nombre de likes / dislikes
            newValues.likes = newValues.usersLiked.length;
            newValues.dislikes = newValues.usersDisliked.length;


            // Mise à jour de la sauce avec les nouvelles valeurs
            

            Sauces.updateOne({ _id: req.params.id }, newValues )
                .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                .catch(error => res.status(400).json({ error }))  
        })
        .catch(error => res.status(500).json({ error }) );
}