# Models

If you have an id, always instantiate with `get`.

    var MyModel = hs.models.Model.extned({
        fields: {
            myField: ''
        }
    });

    var myInstance = MyModel.get(42);
