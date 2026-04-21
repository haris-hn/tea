import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import nestApi from '../utils/nestApi';
import { Star, MessageSquare, ThumbsUp, Send, User } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewSection = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyComment, setReplyComment] = useState('');

  const fetchReviews = async () => {
    if (!productId) return;
    try {
      const { data } = await nestApi.get(`/reviews/product/${productId}`);
      // Ensure data is an array
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Don't show toast on initial fetch to avoid annoyance, but log it
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }
    setLoading(true);
    try {
      await nestApi.post('/reviews', {
        productId,
        rating,
        comment,
        userId: user._id
      });
      setComment('');
      setRating(5);
      toast.success('Review submitted!');
      fetchReviews();
    } catch (error) {
       const msg = error.response?.data?.message || 'Failed to submit review. Try logging in again.';
       toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (reviewId) => {
    if (!user) {
      toast.error('Please login to like');
      return;
    }
    try {
      await nestApi.post(`/reviews/${reviewId}/like`, { userId: user._id });
      fetchReviews();
    } catch (error) {
      toast.error('Failed to like review');
    }
  };

  const handleReply = async (reviewId) => {
    if (!user) {
      toast.error('Please login to reply');
      return;
    }
    try {
      await nestApi.post(`/reviews/${reviewId}/replies`, {
        comment: replyComment,
        userId: user._id
      });
      setReplyComment('');
      setReplyTo(null);
      toast.success('Reply added!');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  return (
    <div id="reviews-section" className="mt-20 space-y-12 max-w-4xl mx-auto px-4 sm:px-0">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-light tracking-tight text-gray-900 italic">User Reviews</h2>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-4 h-4 fill-black text-black" />
          ))}
          <span className="text-xs font-bold text-gray-500 ml-2 uppercase tracking-widest">
            {reviews.length} Reviews
          </span>
        </div>
      </div>

      {/* Write Review Form */}
      {user ? (
        <form onSubmit={handleSubmitReview} className="bg-gray-50/50 p-8 border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Your Rating</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="transition-transform active:scale-90"
                  >
                    <Star className={`w-5 h-5 ${s <= rating ? 'fill-black text-black' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posting as {user.name}</span>
          </div>
          <div className="relative">
            <textarea
              required
              placeholder="Share your thoughts about this tea..."
              className="w-full bg-white border border-gray-100 p-4 text-sm font-medium focus:ring-1 focus:ring-black focus:border-black outline-none transition-all min-h-[120px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center space-x-3"
          >
            <span>{loading ? 'Submitting...' : 'Post Review'}</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      ) : (
        <div className="bg-gray-50/50 p-8 border border-dashed border-gray-200 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Please <a href="/login" className="text-black underline underline-offset-4">login</a> to write a review
            </p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-10">
        {reviews.length === 0 ? (
          <p className="text-center py-20 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic border border-gray-50">
            Be the first to review this tea
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10 border-b border-gray-50 last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">
                      {typeof review.user === 'object' ? review.user?.name : 'Anonymous'}
                    </h4>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-black text-black' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 font-medium leading-relaxed pl-14">
                {review.comment}
              </p>

              <div className="pl-14 flex items-center space-x-8">
                <button 
                  onClick={() => handleLike(review._id)}
                  className={`flex items-center space-x-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                    review.likedBy?.some(id => id === user?._id || id?._id === user?._id) ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <ThumbsUp className={`w-3 h-3 ${review.likedBy?.some(id => id === user?._id || id?._id === user?._id) ? 'fill-black' : ''}`} />
                  <span>{review.likes} Likes</span>
                </button>
                <button 
                  onClick={() => setReplyTo(replyTo === review._id ? null : review._id)}
                  className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>

              {/* Replies */}
              {review.replies?.length > 0 && (
                <div className="pl-14 space-y-6">
                  {review.replies.map((reply, idx) => (
                    <div key={idx} className="bg-gray-50/50 p-4 border-l-2 border-gray-200 space-y-2">
                       <div className="flex items-center space-x-3 mb-1">
                          <h5 className="text-[9px] font-bold text-gray-900 uppercase tracking-widest">
                            {typeof reply.user === 'object' ? reply.user?.name : 'Anonymous'}
                          </h5>
                          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </span>
                       </div>
                       <p className="text-xs text-gray-500 font-medium leading-relaxed">
                          {reply.comment}
                       </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {replyTo === review._id && (
                <div className="pl-14 pt-2 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center space-x-4">
                    <input 
                      className="flex-grow bg-white border border-gray-200 px-4 py-2 text-xs font-medium outline-none focus:border-black"
                      placeholder="Write a reply..."
                      value={replyComment}
                      onChange={(e) => setReplyComment(e.target.value)}
                    />
                    <button 
                      disabled={!replyComment.trim()}
                      onClick={() => handleReply(review._id)}
                      className="px-6 py-2 bg-black text-white text-[9px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
