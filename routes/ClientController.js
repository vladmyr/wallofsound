exports.postClients = function(req, res){
    var client = new Client();
    client.setName(req.body.name);
    client.setId(req.body.id);
    client.setSecret(req.body.secret);
    client.setUserId(req.user.getId());

    ClientRepository.save(client, function(error) {
        if (error) {
            res.send(error)
        } else {
            res.json({ message: "client added!", data: client.toString() });
        }
    });
}
exports.getClients = function(req, res) {
    ClientRepository.findByUserId(req.user.getId(), function(error, arrClientSchema) {
        if (error) {
            res.send(error);
        } else {
            res.json(arrClientSchema);
        }
    });
}