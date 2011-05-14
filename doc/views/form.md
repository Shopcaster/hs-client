# hs-client Forms

Forms in hs-client are a subclass of `hs.views.View`. The basic form superclass can be found at `hs.views.Form`.

**this doc needs work**

    var myForm = hs.views.Form.extend({
        fields: [
            {
                'name': 'fieldName',
                'type': 'text',
                'placeholder': 'Test Field',
                'hide': false
            }
        ],
        validateFieldName: function(value, callback){
            if (/* value is good */)
                callback(true);
            else
                callback(false);
        },
        submit: function(){
            hs.log('fieldName = ', this.values.fieldName);
        }
    });
-
    <div id="myFormTemplate">
        <form>
            {{#form}}{{/form}}
            <input type="submit" />
        </form>
    </div>