var data = [
	{ ToDo: 1, InProgress: 0, QA: 0, ReleaseReady: 0, Released: 0 },
	{ ToDo: 3, InProgress: 1, QA: 0, ReleaseReady: 0, Released: 0 },
	{ ToDo: 6, InProgress: 2, QA: 1, ReleaseReady: 0, Released: 0 },
	{ ToDo: 7, InProgress: 2, QA: 2, ReleaseReady: 1, Released: 0 },
	{ ToDo: 5, InProgress: 2, QA: 4, ReleaseReady: 2, Released: 1 },
	{ ToDo: 4, InProgress: 2, QA: 5, ReleaseReady: 5, Released: 1 },
	{ ToDo: 3, InProgress: 2, QA: 4, ReleaseReady: 8, Released: 1 },
	{ ToDo: 2, InProgress: 2, QA: 5, ReleaseReady: 9, Released: 1 },
	{ ToDo: 2, InProgress: 2, QA: 6, ReleaseReady: 9, Released: 1 },
	{ ToDo: 1, InProgress: 2, QA: 4, ReleaseReady: 8, Released: 5 }
]

var lanes = [ {name: 'ToDo', color: '#f00'}, {name: 'InProgress', color: '#ff0'}, {name: 'QA', color: '#0f0'}, {name: 'ReleaseReady', color: '#fff'}, {name: 'Released', color: '#00f'} ]

function makeCFD(canvas, data, lanes) {
	populateLanes(data, lanes)

	$(lanes).each(function(i, lane) {
		var lanePath = createBoundingPath(canvas, lane)
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

function createBoundingPath(canvas, lane) {
	var len = lane['max'].length
	var hstep = Math.floor((canvas.width - 100) / len)
	var vstep = Math.floor((canvas.height - 100) / lane['max'][len - 1])
	
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
