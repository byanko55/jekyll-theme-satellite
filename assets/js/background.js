/**
 * Stars
 * Inspired by Steve Courtney's poster art for Celsius GS's Drifter - http://celsiusgs.com/drifter/posters.php
 * by Cory Hughart - http://coryhughart.com
 */

// Settings
var particleCount = 40,
    flareCount = 16,
    motion = 0.05,
    tilt = 0.05,
    color = '#44b5fd',
    colorPalette = ["#c13c3c", "#c13cc1", "#3c3cc1", "#3cc1c1", "#3cc13c", "#c1c13c"],
    particleSizeBase = 2,
    particleSizeMultiplier = 0.5,
    flareSizeBase = 100,
    flareSizeMultiplier = 100,
    lineWidth = 1,
    linkChance = 75, // chance per frame of link, higher = smaller chance
    linkLengthMin = 5, // min linked vertices
    linkLengthMax = 7, // max linked vertices
    linkOpacity = 0.375; // number between 0 & 1
    linkFade = 90, // link fade-out frames
    linkSpeed = 1, // distance a link travels in 1 frame
    glareAngle = -60,
    glareOpacityMultiplier = 0.05,
    renderParticles = true,
    renderParticleGlare = true,
    renderFlares = true,
    renderLinks = true,
    renderMesh = false,
    flicker = true,
    flickerSmoothing = 15, // higher = smoother flicker
    blurSize = 0,
    orbitTilt = true,
    randomMotion = true,
    noiseLength = 1000,
    noiseStrength = 1;

var canvas = document.getElementById('stars'),
    context = canvas.getContext('2d'),
    mouse = { x: 0, y: 0 },
    m = {},
    r = 0,
    c = 1000, // multiplier for delaunay points, since floats too small can mess up the algorithm
    n = 0,
    nAngle = (Math.PI * 2) / noiseLength,
    nRad = 100,
    nScale = 0.5,
    nPos = {x: 0, y: 0},
    points = [],
    vertices = [],
    triangles = [],
    links = [],
    particles = [],
    flares = [];

// Delaunay Triangulation
var EPSILON = 1.0 / 1048576.0;

function randomColor(colors){
    return colors[Math.floor(Math.random() * colors.length)];
}

function supertriangle(vertices) {
    var xmin = Number.POSITIVE_INFINITY,
        ymin = Number.POSITIVE_INFINITY,
        xmax = Number.NEGATIVE_INFINITY,
        ymax = Number.NEGATIVE_INFINITY,
        i, dx, dy, dmax, xmid, ymid;

    for(i = vertices.length; i--; ) {
        if(vertices[i][0] < xmin) xmin = vertices[i][0];
        if(vertices[i][0] > xmax) xmax = vertices[i][0];
        if(vertices[i][1] < ymin) ymin = vertices[i][1];
        if(vertices[i][1] > ymax) ymax = vertices[i][1];
    }

    dx = xmax - xmin;
    dy = ymax - ymin;
    dmax = Math.max(dx, dy);
    xmid = xmin + dx * 0.5;
    ymid = ymin + dy * 0.5;

    return [
        [xmid - 20 * dmax, ymid -      dmax],
        [xmid            , ymid + 20 * dmax],
        [xmid + 20 * dmax, ymid -      dmax]
    ];
}

function circumcircle(vertices, i, j, k) {
    var x1 = vertices[i][0],
        y1 = vertices[i][1],
        x2 = vertices[j][0],
        y2 = vertices[j][1],
        x3 = vertices[k][0],
        y3 = vertices[k][1],
        fabsy1y2 = Math.abs(y1 - y2),
        fabsy2y3 = Math.abs(y2 - y3),
        xc, yc, m1, m2, mx1, mx2, my1, my2, dx, dy;

    /* Check for coincident points */
    if(fabsy1y2 < EPSILON && fabsy2y3 < EPSILON)
        throw new Error("Eek! Coincident points!");

    if(fabsy1y2 < EPSILON) {
        m2  = -((x3 - x2) / (y3 - y2));
        mx2 = (x2 + x3) / 2.0;
        my2 = (y2 + y3) / 2.0;
        xc  = (x2 + x1) / 2.0;
        yc  = m2 * (xc - mx2) + my2;
    }
    else if(fabsy2y3 < EPSILON) {
        m1  = -((x2 - x1) / (y2 - y1));
        mx1 = (x1 + x2) / 2.0;
        my1 = (y1 + y2) / 2.0;
        xc  = (x3 + x2) / 2.0;
        yc  = m1 * (xc - mx1) + my1;
    }
    else {
        m1  = -((x2 - x1) / (y2 - y1));
        m2  = -((x3 - x2) / (y3 - y2));
        mx1 = (x1 + x2) / 2.0;
        mx2 = (x2 + x3) / 2.0;
        my1 = (y1 + y2) / 2.0;
        my2 = (y2 + y3) / 2.0;
        xc  = (m1 * mx1 - m2 * mx2 + my2 - my1) / (m1 - m2);
        yc  = (fabsy1y2 > fabsy2y3) ?
            m1 * (xc - mx1) + my1 :
            m2 * (xc - mx2) + my2;
    }

    dx = x2 - xc;
    dy = y2 - yc;
    return {i: i, j: j, k: k, x: xc, y: yc, r: dx * dx + dy * dy};
}

function dedup(edges) {
    var i, j, a, b, m, n;

    for(j = edges.length; j; ) {
        b = edges[--j];
        a = edges[--j];

        for(i = j; i; ) {
            n = edges[--i];
            m = edges[--i];

            if((a === m && b === n) || (a === n && b === m)) {
                edges.splice(j, 2);
                edges.splice(i, 2);
                break;
            }
        }
    }
}

function Delaunay(vertices, key) {
    var n = vertices.length,
        i, j, indices, st, open, closed, edges, dx, dy, a, b, c;

    /* Bail if there aren't enough vertices to form any triangles. */
    if(n < 3)
        return [];

    /* Slice out the actual vertices from the passed objects. (Duplicate the
    * array even if we don't, though, since we need to make a supertriangle
    * later on!) */
    vertices = vertices.slice(0);

    if(key)
        for(i = n; i--; )
            vertices[i] = vertices[i][key];

    /* Make an array of indices into the vertex array, sorted by the
    * vertices' x-position. */
    indices = new Array(n);

    for(i = n; i--; )
        indices[i] = i;

    indices.sort(function(i, j) {
        return vertices[j][0] - vertices[i][0];
    });

    /* Next, find the vertices of the supertriangle (which contains all other
    * triangles), and append them onto the end of a (copy of) the vertex
    * array. */
    st = supertriangle(vertices);
    vertices.push(st[0], st[1], st[2]);
    
    /* Initialize the open list (containing the supertriangle and nothing
    * else) and the closed list (which is empty since we havn't processed
    * any triangles yet). */
    open   = [circumcircle(vertices, n + 0, n + 1, n + 2)];
    closed = [];
    edges  = [];

    /* Incrementally add each vertex to the mesh. */
    for(i = indices.length; i--; edges.length = 0) {
        c = indices[i];

        /* For each open triangle, check to see if the current point is
            * inside it's circumcircle. If it is, remove the triangle and add
            * it's edges to an edge list. */
        for(j = open.length; j--; ) {
            /* If this point is to the right of this triangle's circumcircle,
            * then this triangle should never get checked again. Remove it
            * from the open list, add it to the closed list, and skip. */
            dx = vertices[c][0] - open[j].x;

            if(dx > 0.0 && dx * dx > open[j].r) {
                closed.push(open[j]);
                open.splice(j, 1);
                continue;
            }

            /* If we're outside the circumcircle, skip this triangle. */
            dy = vertices[c][1] - open[j].y;

            if(dx * dx + dy * dy - open[j].r > EPSILON)
                continue;

            /* Remove the triangle and add it's edges to the edge list. */
            edges.push(
                open[j].i, open[j].j,
                open[j].j, open[j].k,
                open[j].k, open[j].i
            );

            open.splice(j, 1);
        }

        /* Remove any doubled edges. */
        dedup(edges);

        /* Add a new triangle for each edge. */
        for(j = edges.length; j; ) {
            b = edges[--j];
            a = edges[--j];
            open.push(circumcircle(vertices, a, b, c));
        }
    }

    /* Copy any remaining open triangles to the closed list, and then
    * remove any triangles that share a vertex with the supertriangle,
    * building a list of triplets that represent triangles. */
    for(i = open.length; i--; )
        closed.push(open[i]);

    open.length = 0;

    for(i = closed.length; i--; )
        if(closed[i].i < n && closed[i].j < n && closed[i].k < n)
            open.push(closed[i].i, closed[i].j, closed[i].k);

    /* Yay, we're done! */
    return open;
}

function init() {
    var i, j, k;

    // requestAnimFrame polyfill
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function( callback ){
            window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Size canvas
    resize();

    mouse.x = canvas.clientWidth / 2;
    mouse.y = canvas.clientHeight / 2;

    // Create particle positions
    for (i = 0; i < particleCount; i++) {
        var p = new Particle();
        particles.push(p);
        points.push([p.x*c, p.y*c]);
    }

    vertices = Delaunay(points);
    // Create an array of "triangles" (groups of 3 indices)
    var tri = [];

    for (i = 0; i < vertices.length; i++) {
        if (tri.length == 3) {
            triangles.push(tri);
            tri = [];
        }

        tri.push(vertices[i]);
    }

    // Tell all the particles who their neighbors are
    for (i = 0; i < particles.length; i++) {
        // Loop through all tirangles
        for (j = 0; j < triangles.length; j++) {
            // Check if this particle's index is in this triangle
            k = triangles[j].indexOf(i);
            // If it is, add its neighbors to the particles contacts list
            if (k !== -1) {
                triangles[j].forEach(function(value, index, array) {
                    if (value !== i && particles[i].neighbors.indexOf(value) == -1) {
                        particles[i].neighbors.push(value);
                    }
                });
            }
        }
    }

    if (renderFlares) {
        // Create flare positions
        for (i = 0; i < flareCount; i++) {
            flares.push(new Flare());
        }
    }

    // Motion mode
    if ('ontouchstart' in document.documentElement && window.DeviceOrientationEvent) {
        // console.log('Using device orientation');
        window.addEventListener('deviceorientation', function(e) {
            mouse.x = (canvas.clientWidth / 2) - ((e.gamma / 90) * (canvas.clientWidth / 2) * 2);
            mouse.y = (canvas.clientHeight / 2) - ((e.beta / 90) * (canvas.clientHeight / 2) * 2);
        }, true);
    }
    else {
        // Mouse move listener
        // console.log('Using mouse movement');
        document.body.addEventListener('mousemove', function(e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
    }

    // Animation loop
    (function animloop(){
        requestAnimFrame(animloop);
        resize();
        render();
    })();
}

function render() {
    if (randomMotion) {
        n++;

        if (n >= noiseLength) {
            n = 0;
        }

        nPos = noisePoint(n);
    }

    // Clear
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (blurSize > 0) {
        context.shadowBlur = blurSize;
        context.shadowColor = randomColor(colorPalette);
    }

    if (renderParticles) {
        // Render particles
        for (var i = 0; i < particleCount; i++) {
            particles[i].render();
        }
    }

    if (renderMesh) {
        // Render all lines
        context.beginPath();

        for (var v = 0; v < vertices.length-1; v++) {
            // Splits the array into triplets
            if ((v + 1) % 3 === 0) { continue; }

            var p1 = particles[vertices[v]],
                p2 = particles[vertices[v+1]];

            var pos1 = position(p1.x, p1.y, p1.z),
                pos2 = position(p2.x, p2.y, p2.z);

            context.moveTo(pos1.x, pos1.y);
            context.lineTo(pos2.x, pos2.y);
        }

        context.strokeStyle = randomColor(colorPalette);
        context.lineWidth = lineWidth;
        context.stroke();
        context.closePath();
    }

    if (renderLinks) {
        // Possibly start a new link
        if (random(0, linkChance) == linkChance) {
            var length = random(linkLengthMin, linkLengthMax);
            var start = random(0, particles.length-1);
            startLink(start, length);
        }

        // Render existing links
        // Iterate in reverse so that removing items doesn't affect the loop
        for (var l = links.length-1; l >= 0; l--) {
            if (links[l] && !links[l].finished) {
                links[l].render();
            }
            else {
                delete links[l];
            }
        }
    }

    if (renderFlares) {
        // Render flares
        for (var j = 0; j < flareCount; j++) {
            flares[j].render();
        }
    }
}

function resize() {
    canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    canvas.height = canvas.width * (canvas.clientHeight / canvas.clientWidth);
}

function startLink(vertex, length) {
    links.push(new Link(vertex, length));
}

// Particle class
var Particle = function() {
    this.x = random(-0.1, 1.1, true);
    this.y = random(-0.1, 1.1, true);
    this.z = random(0,4);
    this.color = randomColor(colorPalette);
    this.opacity = random(0.1,1,true);
    this.flicker = 0;
    this.neighbors = []; // placeholder for neighbors
};

Particle.prototype.render = function() {
    var pos = position(this.x, this.y, this.z),
        r = ((this.z * particleSizeMultiplier) + particleSizeBase) * (sizeRatio() / 1000),
        o = this.opacity;

    if (flicker) {
        var newVal = random(-0.5, 0.5, true);
        this.flicker += (newVal - this.flicker) / flickerSmoothing;

        if (this.flicker > 0.5) this.flicker = 0.5;
        if (this.flicker < -0.5) this.flicker = -0.5;

        o += this.flicker;

        if (o > 1) o = 1;
        if (o < 0) o = 0;
    }

    context.fillStyle = this.color;
    context.globalAlpha = o;
    context.beginPath();
    context.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();

    if (renderParticleGlare) {
        context.globalAlpha = o * glareOpacityMultiplier;
        context.ellipse(pos.x, pos.y, r * 100, r, (glareAngle - ((nPos.x - 0.5) * noiseStrength * motion)) * (Math.PI / 180), 0, 2 * Math.PI, false);
        context.fill();
        context.closePath();
    }

    context.globalAlpha = 1;
};

// Flare class
var Flare = function() {
    this.x = random(-0.25, 1.25, true);
    this.y = random(-0.25, 1.25, true);
    this.z = random(0,2);
    this.color = randomColor(colorPalette);
    this.opacity = random(0.001, 0.01, true);
};

Flare.prototype.render = function() {
    var pos = position(this.x, this.y, this.z),
        r = ((this.z * flareSizeMultiplier) + flareSizeBase) * (sizeRatio() / 1000);

    // Feathered circles
    context.beginPath();
    context.globalAlpha = this.opacity;
    context.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
    context.globalAlpha = 1;
};

// Link class
var Link = function(startVertex, numPoints) {
    this.length = numPoints;
    this.verts = [startVertex];
    this.stage = 0;
    this.linked = [startVertex];
    this.distances = [];
    this.traveled = 0;
    this.fade = 0;
    this.finished = false;
};

Link.prototype.render = function() {
    // Stages:
    // 0. Vertex collection
    // 1. Render line reaching from vertex to vertex
    // 2. Fade out
    // 3. Finished (delete me)

    var i, p, pos, points;

    switch (this.stage) {
        // VERTEX COLLECTION STAGE
        case 0:
            // Grab the last member of the link
            var last = particles[this.verts[this.verts.length-1]];
            if (last && last.neighbors && last.neighbors.length > 0) {
                // Grab a random neighbor
                var neighbor = last.neighbors[random(0, last.neighbors.length-1)];
                // If we haven't seen that particle before, add it to the link
                if (this.verts.indexOf(neighbor) == -1) {
                this.verts.push(neighbor);
                }
                // If we have seen that particle before, we'll just wait for the next frame
            }
            else {
                this.stage = 3;
                this.finished = true;
            }

            if (this.verts.length >= this.length) {
                // Calculate all distances at once
                for (i = 0; i < this.verts.length-1; i++) {
                var p1 = particles[this.verts[i]],
                    p2 = particles[this.verts[i+1]],
                    dx = p1.x - p2.x,
                    dy = p1.y - p2.y,
                    dist = Math.sqrt(dx*dx + dy*dy);

                    this.distances.push(dist);
                }
                this.stage = 1;
            }
            break;

        // RENDER LINE ANIMATION STAGE
        case 1:
            if (this.distances.length > 0) {

                points = [];

                // Gather all points already linked
                for (i = 0; i < this.linked.length; i++) {
                    p = particles[this.linked[i]];
                    pos = position(p.x, p.y, p.z);
                    points.push([pos.x, pos.y]);
                }

                var linkSpeedRel = linkSpeed * 0.00001 * canvas.width;
                this.traveled += linkSpeedRel;
                var d = this.distances[this.linked.length-1];
                // Calculate last point based on linkSpeed and distance travelled to next point
                if (this.traveled >= d) {
                    this.traveled = 0;
                    // We've reached the next point, add coordinates to array
                    this.linked.push(this.verts[this.linked.length]);
                    p = particles[this.linked[this.linked.length-1]];
                    pos = position(p.x, p.y, p.z);
                    points.push([pos.x, pos.y]);

                    if (this.linked.length >= this.verts.length) {
                        this.stage = 2;
                    }
                }
                else {
                    // We're still travelling to the next point, get coordinates at travel distance
                    // http://math.stackexchange.com/a/85582
                    var a = particles[this.linked[this.linked.length-1]],
                        b = particles[this.verts[this.linked.length]],
                        t = d - this.traveled,
                        x = ((this.traveled * b.x) + (t * a.x)) / d,
                        y = ((this.traveled * b.y) + (t * a.y)) / d,
                        z = ((this.traveled * b.z) + (t * a.z)) / d;

                    pos = position(x, y, z);
                    points.push([pos.x, pos.y]);
                }

                this.drawLine(points);
            }
            else {
                this.stage = 3;
                this.finished = true;
            }
            break;

        // FADE OUT STAGE
        case 2:
            if (this.verts.length > 1) {
                if (this.fade < linkFade) {
                    this.fade++;

                    // Render full link between all vertices and fade over time
                    points = [];
                    var alpha = (1 - (this.fade / linkFade)) * linkOpacity;

                    for (i = 0; i < this.verts.length; i++) {
                        p = particles[this.verts[i]];
                        pos = position(p.x, p.y, p.z);
                        points.push([pos.x, pos.y]);
                    }
                    
                    this.drawLine(points, alpha);
                }
                else {
                    this.stage = 3;
                    this.finished = true;
                }
            }
            else {
                this.stage = 3;
                this.finished = true;
            }

            break;
        // FINISHED STAGE
        case 3:
        default:
            this.finished = true;
            break;
    }
};

Link.prototype.drawLine = function(points, alpha) {
    if (typeof alpha !== 'number') alpha = linkOpacity;

    if (points.length > 1 && alpha > 0) {
        context.globalAlpha = alpha;
        context.beginPath();

        for (var i = 0; i < points.length-1; i++) {
            context.moveTo(points[i][0], points[i][1]);
            context.lineTo(points[i+1][0], points[i+1][1]);
        }

        context.strokeStyle = '#888';
        context.lineWidth = lineWidth;
        context.stroke();
        context.closePath();
        context.globalAlpha = 1;
    }
};

// Utils
function noisePoint(i) {
    var a = nAngle * i,
        cosA = Math.cos(a),
        sinA = Math.sin(a),
        rad = nRad;

    return {
        x: rad * cosA,
        y: rad * sinA
    };
}

function position(x, y, z) {
    return {
        x: (x * canvas.width) + ((((canvas.width / 2) - mouse.x + ((nPos.x - 0.5) * noiseStrength)) * z) * motion),
        y: (y * canvas.height) + ((((canvas.height / 2) - mouse.y + ((nPos.y - 0.5) * noiseStrength)) * z) * motion)
    };
}

function sizeRatio() {
    return canvas.width >= canvas.height ? canvas.width : canvas.height;
}

function random(min, max, float) {
    return float ?
        Math.random() * (max - min) + min :
        Math.floor(Math.random() * (max - min + 1)) + min;
}

// init
if (canvas) init();