var annotationRequestObject = {
    api_key: '',
    instructions: '',
    attachment: '',
    attachment_type: '',
    objects_to_annotate: [],
    with_labels: false,
    callback_url: '',
    error_list: [],
    completed: false
}

BoundingBox.prototype.ret_req = function (){
    return annotationRequestObject;
}

function BoundingBox(APIKEY, instruction, attachment_url, attachment_type, objects_to_annotate, label, callback_url) {
    if (api_key_is_valid(APIKEY)){
        annotationRequestObject.api_key = APIKEY;
    }
    if (instruction_is_valid(instruction)){
        annotationRequestObject.instructions = instruction;
    }
    if (attachment_url_is_valid(attachment_url)){
        annotationRequestObject.attachment = attachment_url;
    }
    if (attachment_type_is_valid(attachment_type)){
        annotationRequestObject.attachment_type = attachment_type;
    }
    if (objects_to_annotate_is_valid(objects_to_annotate)){
        annotationRequestObject.objects_to_annotate = objects_to_annotate;
    }
    if (label_is_valid(label)){
        annotationRequestObject.with_labels = true;
    }
    if (callback_url_is_valid(callback_url)){
        annotationRequestObject.callback_url = callback_url
    }
}

function addError(err){
    annotationRequestObject.error_list.push(err);
}

function api_key_is_valid (api_key){
    // For right now, I'm just going
    // to assume that any API key is valid'
    // as long as it passes basic tests.
    if (basic_string_check(api_key)) return true;

    // Hasn't returned, false.'
    addError('invalid API key.');
    return false;
}

function instruction_is_valid (instruction){
    // Functionality similar to api_key_is_valid function.
    // ...
    if (basic_string_check(instruction)) return true;

    addError('invalid instruction');
    return false;
}

function attachment_url_is_valid (attachment_url){
    // @input: url
    if (basic_string_check(attachment_url) 
    && is_valid_url(attachment_url)) return true;

    addError('invalid attachment URL');
    return false;
}

function attachment_type_is_valid (attachment_type){
    if (basic_string_check(attachment_type) && 
    attachment_type.toLowerCase() === 'image') {
        // we only support attachment_types of type 'image'
        return true;
    }

    addError('invalid attachment type');
    return false;
}

function objects_to_annotate_is_valid (objects_to_annotate){
    // @input: list of annotations
    if (objects_to_annotate && objects_to_annotate.length > 0){
        return true;
    }

    addError('invalid annotation attempt');
    return false;
}

function label_is_valid (label){
    if (typeof label === 'boolean') return true;

    addError('invalid label');
    return false; 
}

function callback_url_is_valid (callback_url) {
    if (basic_string_check(callback_url) && is_valid_url(callback_url)){
        return true;
    }

    addError('invalid callback url')
    return false;
}

function is_valid_url(url){
    var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    var t = url;

    if (t.match(regex)) {
        return true;
    } else {
        return false;
    }
}

function basic_string_check(str){
    if (str && str.length > 0) {
        return true;
    }

    return false;
}

module.exports = BoundingBox;