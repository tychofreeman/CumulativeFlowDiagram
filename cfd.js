var data = [
	{ ToDo: 11, InProgress: 3, ReadyToDeploy: 4, QA: 9, ReleaseReady: 0,  Released: 0 },
	{ ToDo: 11, InProgress: 1, ReadyToDeploy: 6, QA: 9, ReleaseReady: 0,  Released: 0 },
	{ ToDo: 11, InProgress: 1, ReadyToDeploy: 6, QA: 9, ReleaseReady: 0,  Released: 0 },
	{ ToDo: 11, InProgress: 3, ReadyToDeploy: 1, QA: 6, ReleaseReady: 8,  Released: 0 },
	{ ToDo: 10, InProgress: 4, ReadyToDeploy: 1, QA: 0, ReleaseReady: 14, Released: 0 },
	{ ToDo: 13, InProgress: 3, ReadyToDeploy: 2, QA: 0, ReleaseReady: 0,  Released: 14 },
	{ ToDo: 13, InProgress: 3, ReadyToDeploy: 2, QA: 0, ReleaseReady: 0,  Released: 14 },
	{ ToDo: 12, InProgress: 7, ReadyToDeploy: 3, QA: 0, ReleaseReady: 0,  Released: 14 },
	{ ToDo: 12, InProgress: 7, ReadyToDeploy: 3, QA: 0, ReleaseReady: 0,  Released: 14 },
	{ ToDo: 12, InProgress: 4, ReadyToDeploy: 6, QA: 0, ReleaseReady: 0,  Released: 14 }
]

var lanes = [
	{name: 'ToDo', color: '#999'},
	{name: 'InProgress', color: '#000'},
	{name: 'ReadyToDeploy', color: '#982'},
	{name: 'QA', color: '#652'},
	{name: 'ReleaseReady', color: '#256'},
	{name: 'Released', color: '#555'} ]

function makeCFD(canvas, data, lanes) {
	populateLanes(data, lanes)
	var maxLane = lanes[lanes.length - 1]['max']
	var vstep = Math.floor((canvas.height - 100) / maxLane[maxLane.length - 1])

	$(lanes).each(function(i, lane) {
		var lanePath = createBoundingPath(canvas, lane, vstep)
		fillPath(canvas.getContext('2d'), lane['color'], lanePath)
	})
}

function fillPath(c, color, path) {

	c.fillStyle = color
	c.beginPath()
	c.moveTo(path[0].x, path[0].y)
	$(path).each(function(i, point) {
		c.lineTo(point.x, point.y)
	})

	c.closePath()
	c.fill()
}

function createBoundingPath(canvas, lane, vstep) {
	var len = lane['max'].length
	var hstep = Math.floor((canvas.width - 100) / len)

	function makePoint(value,index) {
		return { x: index * hstep, y: (canvas.height - value * vstep) }
	}

	var max = $.map(lane['max'], makePoint)
	var min = $.map(lane['min'], makePoint).reverse()

	return $.merge(max, min)
}


function populateLanes(data, lanes) {
	var prevMax = null
	$(lanes.reverse()).each(function(i, lane) {
		lane['max'] = new Array()
		lane['min'] = prevMax || zeros(data.length) // [0,0,0,0,0,0,0,0,0,0]
		$(data).each(function(j, sample) {
			lane['max'].push(sample[lane['name']] + lane['min'][j])
		})
		prevMax = lane['max']
	})
}

function zeros(len) {
	return $.map(new Array(len), function(v) { return 0 })
}

$(document).ready(function() {

	var canvas = document.getElementById('example')

	makeCFD(canvas, data, lanes)
})
