var sum_to_n_a = function(n) {
    var limit = n < 0 ? -n - 1 : n;
    var sum = 0;

    for (var i = 1; i <= limit; i++) {
        sum += i;
    }

    return sum;
};

var sum_to_n_b = function(n) {
    return (n * (n + 1)) / 2;
};

var sum_to_n_c = function(n) {
    if (n <= 0) return 0;

    return n + sum_to_n_c(n - 1);
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };
}
