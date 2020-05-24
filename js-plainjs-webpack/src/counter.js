if (document.getElementById("counter")) {
	const element = document.getElementById("value");
	if (element) {
		var counter = 0;

		function displayCounter() {
			element.innerHTML = counter.toString();
		}
		displayCounter();

		const button = document.getElementById("button");
		if (button && button.addEventListener) {
			// IE9+
			button.addEventListener("click", function () {
				counter++;
				displayCounter();
			});
		}
	}
}
