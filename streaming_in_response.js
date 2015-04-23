// Copyright (c) 2015 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

'use strict';

var InResponse = require('./in_response');
var inherits = require('util').inherits;

var InArgStream = require('./argstream').InArgStream;

function StreamingInResponse(id, options) {
    options = options || {};
    var self = this;
    InResponse.call(self, id, options);

    self.streamed = true;
    self._argstream = InArgStream();
    self.arg1 = self._argstream.arg1;
    self.arg2 = self._argstream.arg2;
    self.arg3 = self._argstream.arg3;
    self._argstream.on('error', passError);
    self._argstream.on('finish', onFinish);

    function passError(err) {
        self.emit('error', err);
    }

    function onFinish() {
        self.emit('finish');
    }
}

inherits(StreamingInResponse, InResponse);

StreamingInResponse.prototype.type = 'tchannel.incoming-response.streaming';

StreamingInResponse.prototype.handleFrame = function handleFrame(parts) {
    var self = this;
    self._argstream.handleFrame(parts);
};

module.exports = StreamingInResponse;
