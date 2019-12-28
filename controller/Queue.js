
function Queue() {
    this.oldestIndex = 1;
    this.newestIndex = 1;
    this.storage = [];
}

// keeping track of size and correct index or current data element
Queue.prototype.size = function() {
    return this.newestIndex - this.oldestIndex;
}

// adding new elements to the queue
Queue.prototype.enqueue = function(data) {
    this.storage[this.newestIndex] = data;
    this.newestIndex++;
}

// removing the first input element from queue and checking whether the queue has elements
Queue.prototype.dequeue = function() {
    let oldestIndex = this.oldestIndex;
    let newestIndex = this.newestIndex;
    let deletedData = this.storage[oldestIndex];

    if (this.isEmpty() == false){
        delete this.storage[oldestIndex];
        this.oldestIndex++;
        return deletedData;
    } else return "queue empty"
}

// check whether Queue is empty

Queue.prototype.isEmpty = function() {
    if (this.oldestIndex == this.newestIndex){
        return true;
    } else return false;
}



module.exports = Queue;