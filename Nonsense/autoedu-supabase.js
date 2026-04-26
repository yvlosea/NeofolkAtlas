// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// AutoEdu Supabase Integration Module
// Handles database operations, real-time subscriptions, and offline sync
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

// Supabase Configuration
const AUTOEDU_SUPABASE_URL = 'https://your-project.supabase.co'; // Replace with your Supabase URL
const AUTOEDU_SUPABASE_KEY = 'your-anon-key'; // Replace with your anon key

let autoeduSupabase = null;
let autoeduRealtimeChannels = [];

// Initialize Supabase Client
function initAutoEduSupabase() {
  // Check if Supabase is already initialized
  if (autoeduSupabase) return autoeduSupabase;
  
  // Use existing supabase client if available (from main app)
  if (typeof supabase !== 'undefined') {
    autoeduSupabase = supabase;
    console.log('AutoEdu: Connected to existing Supabase client');
    return autoeduSupabase;
  }
  
  // Check for Supabase library
  if (typeof window.createClient === 'undefined') {
    console.error('AutoEdu: Supabase library not loaded. Please include @supabase/supabase-js');
    return null;
  }
  
  // Create new client
  autoeduSupabase = window.createClient(AUTOEDU_SUPABASE_URL, AUTOEDU_SUPABASE_KEY, {
    db: {
      schema: 'public'
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  });
  
  console.log('AutoEdu: Supabase client initialized');
  return autoeduSupabase;
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// PROFILE OPERATIONS
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function getAutoEduProfile(userId) {
  if (!autoeduSupabase) initAutoEduSupabase();
  if (!autoeduSupabase) return null;
  
  try {
    const { data, error } = await autoeduSupabase
      .from('autoedu_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // Profile doesn't exist, create it
      if (error.code === 'PGRST116') {
        return await createAutoEduProfile(userId);
      }
      throw error;
    }
    
    return data;
  } catch (err) {
    console.error('AutoEdu: Error fetching profile:', err);
    return null;
  }
}

async function createAutoEduProfile(userId, profileData = {}) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    const { data, error } = await autoeduSupabase
      .from('autoedu_profiles')
      .insert([{
        user_id: userId,
        display_name: profileData.display_name || 'Anonymous',
        bio: profileData.bio || '',
        location: profileData.location || '',
        credibility: 10,
        neoscore: 0,
        ...profileData
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('AutoEdu: Error creating profile:', err);
    return null;
  }
}

async function updateAutoEduProfile(userId, updates) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    const { data, error } = await autoeduSupabase
      .from('autoedu_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('AutoEdu: Error updating profile:', err);
    return null;
  }
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// SUBMISSION OPERATIONS
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function createSubmission(userId, submissionData) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    // Calculate base score and category from type
    const typeConfig = AUTOEDU_SUBMISSION_TYPES[submissionData.type];
    if (!typeConfig) {
      throw new Error('Invalid submission type');
    }
    
    const { data, error } = await autoeduSupabase
      .from('autoedu_submissions')
      .insert([{
        user_id: userId,
        type: submissionData.type,
        category: typeConfig.category,
        domain: submissionData.domain,
        title: submissionData.title,
        abstract: submissionData.abstract,
        content: submissionData.content,
        word_count: submissionData.wordCount || 0,
        external_link: submissionData.externalLink || null,
        tags: submissionData.tags || [],
        file_urls: submissionData.fileUrls || [],
        status: 'pending',
        self_score: typeConfig.baseScore
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update monthly stats
    await updateMonthlyStats(userId, typeConfig.category, submissionData.type);
    
    return { success: true, submission: data };
  } catch (err) {
    console.error('AutoEdu: Error creating submission:', err);
    return { success: false, error: err.message };
  }
}

async function getSubmissions(filters = {}) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    let query = autoeduSupabase
      .from('autoedu_submissions')
      .select(`
        *,
        autoedu_profiles!inner(display_name, credibility)
      `);
    
    // Apply filters
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status);
    } else {
      // Default: only show approved/featured for public
      query = query.in('status', ['approved', 'featured']);
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    if (filters.domain) {
      query = query.eq('domain', filters.domain);
    }
    
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters.featured) {
      query = query.eq('featured', true);
    }
    
    if (filters.arbiterApproved) {
      query = query.eq('arbiter_approved', true);
    }
    
    // Ordering
    if (filters.sortBy) {
      query = query.order(filters.sortBy, { ascending: filters.ascending || false });
    } else {
      query = query.order('created_at', { ascending: false });
    }
    
    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('AutoEdu: Error fetching submissions:', err);
    return [];
  }
}

async function getSubmissionById(submissionId) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    const { data, error } = await autoeduSupabase
      .from('autoedu_submissions')
      .select(`
        *,
        autoedu_profiles!inner(display_name, credibility, user_id),
        autoedu_comments(
          id, text, created_at,
          autoedu_profiles!inner(display_name)
        )
      `)
      .eq('id', submissionId)
      .single();
    
    if (error) throw error;
    
    // Increment view count
    await autoeduSupabase
      .from('autoedu_submissions')
      .update({ views: data.views + 1 })
      .eq('id', submissionId);
    
    return data;
  } catch (err) {
    console.error('AutoEdu: Error fetching submission:', err);
    return null;
  }
}

async function updateSubmission(submissionId, userId, updates) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    const { data, error } = await autoeduSupabase
      .from('autoedu_submissions')
      .update(updates)
      .eq('id', submissionId)
      .eq('user_id', userId) // Ensure ownership
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, submission: data };
  } catch (err) {
    console.error('AutoEdu: Error updating submission:', err);
    return { success: false, error: err.message };
  }
}

async function deleteSubmission(submissionId, userId) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    const { error } = await autoeduSupabase
      .from('autoedu_submissions')
      .delete()
      .eq('id', submissionId)
      .eq('user_id', userId);
    
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('AutoEdu: Error deleting submission:', err);
    return { success: false, error: err.message };
  }
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// RATING OPERATIONS (Community Layer)
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function rateSubmission(submissionId, raterId, rating, comment = null) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    // Insert or update rating
    const { data, error } = await autoeduSupabase
      .from('autoedu_ratings')
      .upsert([{
        submission_id: submissionId,
        rater_id: raterId,
        rating: rating,
        comment: comment
      }], {
        onConflict: 'submission_id,rater_id'
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Recalculate community rating
    await recalculateCommunityRating(submissionId);
    
    return { success: true, rating: data };
  } catch (err) {
    console.error('AutoEdu: Error rating submission:', err);
    return { success: false, error: err.message };
  }
}

async function recalculateCommunityRating(submissionId) {
  if (!autoeduSupabase) return;
  
  try {
    // Get all ratings for this submission
    const { data: ratings, error } = await autoeduSupabase
      .from('autoedu_ratings')
      .select('rating')
      .eq('submission_id', submissionId);
    
    if (error) throw error;
    
    if (ratings && ratings.length > 0) {
      const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
      
      await autoeduSupabase
        .from('autoedu_submissions')
        .update({
          community_rating: avgRating.toFixed(1),
          community_ratings_count: ratings.length
        })
        .eq('id', submissionId);
    }
  } catch (err) {
    console.error('AutoEdu: Error recalculating rating:', err);
  }
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// ENGAGEMENT OPERATIONS
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function engageWithSubmission(userId, submissionId, action, metadata = {}) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    // Toggle engagement (bookmark/unbookmark)
    const { data: existing } = await autoeduSupabase
      .from('autoedu_engagements')
      .select('id')
      .eq('user_id', userId)
      .eq('submission_id', submissionId)
      .eq('action', action)
      .single();
    
    if (existing) {
      // Remove engagement (toggle off)
      await autoeduSupabase
        .from('autoedu_engagements')
        .delete()
        .eq('id', existing.id);
      
      // Decrement count
      await updateEngagementCount(submissionId, action, -1);
      
      return { success: true, engaged: false };
    } else {
      // Add engagement
      await autoeduSupabase
        .from('autoedu_engagements')
        .insert([{
          user_id: userId,
          submission_id: submissionId,
          action: action,
          metadata: metadata
        }]);
      
      // Increment count
      await updateEngagementCount(submissionId, action, 1);
      
      return { success: true, engaged: true };
    }
  } catch (err) {
    console.error('AutoEdu: Error engaging with submission:', err);
    return { success: false, error: err.message };
  }
}

async function updateEngagementCount(submissionId, action, delta) {
  if (!autoeduSupabase) return;
  
  try {
    const column = action === 'bookmark' ? 'bookmarks' : 
                   action === 'cite' ? 'citations' : 
                   action === 'reference' ? 'references' : null;
    
    if (!column) return;
    
    // Use RPC for atomic increment
    await autoeduSupabase.rpc('increment_engagement', {
      p_submission_id: submissionId,
      p_column: column,
      p_delta: delta
    });
  } catch (err) {
    console.error('AutoEdu: Error updating engagement count:', err);
  }
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// ARBITER OPERATIONS
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function reviewSubmission(arbiterId, submissionId, decision, notes, originalityScore) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    // Create review record
    const { data: review, error: reviewError } = await autoeduSupabase
      .from('autoedu_arbiter_reviews')
      .insert([{
        submission_id: submissionId,
        arbiter_id: arbiterId,
        decision: decision,
        notes: notes,
        originality_score: originalityScore
      }])
      .select()
      .single();
    
    if (reviewError) throw reviewError;
    
    // Update submission status
    const updates = {
      status: decision === 'approve' ? 'approved' : 'rejected',
      arbiter_approved: decision === 'approve',
      arbiter_id: arbiterId,
      arbiter_notes: notes,
      originality_score: originalityScore
    };
    
    if (decision === 'approve' && originalityScore >= 8) {
      updates.featured = true;
      updates.featured_at = new Date().toISOString();
    }
    
    await autoeduSupabase
      .from('autoedu_submissions')
      .update(updates)
      .eq('id', submissionId);
    
    return { success: true, review };
  } catch (err) {
    console.error('AutoEdu: Error reviewing submission:', err);
    return { success: false, error: err.message };
  }
}

async function getPendingSubmissions(arbiterId, filters = {}) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    let query = autoeduSupabase
      .from('autoedu_submissions')
      .select(`
        *,
        autoedu_profiles!inner(display_name, credibility, total_works)
      `)
      .eq('status', 'pending');
    
    if (filters.domain) {
      query = query.eq('domain', filters.domain);
    }
    
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    
    query = query.order('created_at', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('AutoEdu: Error fetching pending submissions:', err);
    return [];
  }
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// MONTHLY STATS & CAPS
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function getMonthlyStats(userId, year, month) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    const { data, error } = await autoeduSupabase
      .from('autoedu_monthly_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('year', year)
      .eq('month', month)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return data || {
      work_count: 0,
      build_count: 0,
      impact_count: 0,
      academic_count: 0,
      publication_count: 0
    };
  } catch (err) {
    console.error('AutoEdu: Error fetching monthly stats:', err);
    return null;
  }
}

async function updateMonthlyStats(userId, category, type) {
  if (!autoeduSupabase) return;
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  try {
    // Use upsert with conflict resolution
    const categoryColumn = `${category}_count`;
    
    await autoeduSupabase.rpc('increment_monthly_stat', {
      p_user_id: userId,
      p_year: year,
      p_month: month,
      p_category: category,
      p_type: type
    });
  } catch (err) {
    console.error('AutoEdu: Error updating monthly stats:', err);
  }
}

async function checkMonthlyCap(userId, type) {
  const typeConfig = AUTOEDU_SUBMISSION_TYPES[type];
  if (!typeConfig) return { allowed: false, reason: 'Invalid type' };
  
  const now = new Date();
  const stats = await getMonthlyStats(userId, now.getFullYear(), now.getMonth() + 1);
  
  if (!stats) return { allowed: true };
  
  // Check category cap
  const categoryCount = stats[`${typeConfig.category}_count`] || 0;
  const categoryCap = AUTOEDU_MONTHLY_CAPS[typeConfig.category];
  
  if (categoryCount >= categoryCap) {
    return {
      allowed: false,
      reason: `${typeConfig.category} category cap reached: ${categoryCap} submissions this month`
    };
  }
  
  // Check type-specific cap
  const typeCounts = stats.type_counts || {};
  const typeCount = typeCounts[type] || 0;
  
  if (typeCount >= typeConfig.maxPerMonth) {
    return {
      allowed: false,
      reason: `${typeConfig.label} cap reached: ${typeConfig.maxPerMonth} per month`
    };
  }
  
  return { allowed: true, current: categoryCount, cap: categoryCap };
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// GALLERY OPERATIONS
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function getGalleryWorks(galleryType, year, month, limit = 10) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    // Use the view for gallery-ready works
    let query = autoeduSupabase
      .from('autoedu_gallery_works')
      .select('*')
      .eq('status', 'approved');
    
    // Apply gallery-specific filters
    switch (galleryType) {
      case 'best_research':
        query = query.eq('type', 'research').eq('arbiter_approved', true);
        break;
      case 'best_visual':
        query = query.eq('category', 'build');
        break;
      case 'best_impact':
        query = query.eq('category', 'impact');
        break;
      case 'emerging':
        query = query.lt('author_credibility', 50);
        break;
      case 'young_researchers':
        // Would need age data in profile
        query = query.eq('type', 'research');
        break;
    }
    
    // Order by appropriate metric
    if (galleryType === 'best_impact') {
      query = query.order('total_score', { ascending: false });
    } else {
      query = query.order('community_rating', { ascending: false });
    }
    
    query = query.limit(limit);
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('AutoEdu: Error fetching gallery works:', err);
    return [];
  }
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// FEED OPERATIONS
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function getStructuredFeed(userId, limit = 20) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    // Get personalized feed using RPC function
    const { data, error } = await autoeduSupabase
      .rpc('get_structured_feed', {
        p_user_id: userId,
        p_limit: limit
      });
    
    if (error) {
      // Fallback: simple query
      const { data: fallback } = await autoeduSupabase
        .from('autoedu_submissions')
        .select(`
          *,
          autoedu_profiles!inner(display_name)
        `)
        .in('status', ['approved', 'featured'])
        .order('created_at', { ascending: false })
        .limit(limit);
      
      return fallback || [];
    }
    
    return data || [];
  } catch (err) {
    console.error('AutoEdu: Error fetching feed:', err);
    return [];
  }
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// FILE STORAGE
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function uploadFile(file, bucket, path) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    const { data, error } = await autoeduSupabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = autoeduSupabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return { success: true, url: urlData.publicUrl, path: data.path };
  } catch (err) {
    console.error('AutoEdu: Error uploading file:', err);
    return { success: false, error: err.message };
  }
}

async function deleteFile(bucket, path) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    const { error } = await autoeduSupabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('AutoEdu: Error deleting file:', err);
    return { success: false, error: err.message };
  }
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// REAL-TIME SUBSCRIPTIONS
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

function subscribeToSubmission(submissionId, callback) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  const channel = autoeduSupabase
    .channel(`submission:${submissionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'autoedu_submissions',
        filter: `id=eq.${submissionId}`
      },
      (payload) => callback(payload)
    )
    .subscribe();
  
  autoeduRealtimeChannels.push(channel);
  return channel;
}

function subscribeToFeed(callback) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  const channel = autoeduSupabase
    .channel('autoedu_feed')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'autoedu_submissions',
        filter: 'status=eq.approved'
      },
      (payload) => callback(payload)
    )
    .subscribe();
  
  autoeduRealtimeChannels.push(channel);
  return channel;
}

function subscribeToUserSubmissions(userId, callback) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  const channel = autoeduSupabase
    .channel(`user_submissions:${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'autoedu_submissions',
        filter: `user_id=eq.${userId}`
      },
      (payload) => callback(payload)
    )
    .subscribe();
  
  autoeduRealtimeChannels.push(channel);
  return channel;
}

function unsubscribeAll() {
  autoeduRealtimeChannels.forEach(channel => {
    autoeduSupabase.removeChannel(channel);
  });
  autoeduRealtimeChannels = [];
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// OFFLINE SYNC (Service Worker Integration)
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

const AUTOEDU_SYNC_QUEUE = 'autoedu-sync-queue';

async function queueOfflineAction(action, data) {
  // Store in IndexedDB for later sync
  const queue = await getSyncQueue();
  queue.push({
    id: `${Date.now()}_${Math.random()}`,
    action,
    data,
    timestamp: Date.now(),
    retries: 0
  });
  
  await saveSyncQueue(queue);
  
  // Try to sync immediately if online
  if (navigator.onLine) {
    await syncOfflineActions();
  }
}

async function getSyncQueue() {
  return new Promise((resolve) => {
    const request = indexedDB.open('AutoEduDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(AUTOEDU_SYNC_QUEUE)) {
        db.createObjectStore(AUTOEDU_SYNC_QUEUE, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction(AUTOEDU_SYNC_QUEUE, 'readonly');
      const store = tx.objectStore(AUTOEDU_SYNC_QUEUE);
      const getAll = store.getAll();
      
      getAll.onsuccess = () => resolve(getAll.result || []);
      getAll.onerror = () => resolve([]);
    };
    
    request.onerror = () => resolve([]);
  });
}

async function saveSyncQueue(queue) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AutoEduDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction(AUTOEDU_SYNC_QUEUE, 'readwrite');
      const store = tx.objectStore(AUTOEDU_SYNC_QUEUE);
      
      // Clear and repopulate
      store.clear();
      queue.forEach(item => store.add(item));
      
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function syncOfflineActions() {
  if (!autoeduSupabase) initAutoEduSupabase();
  if (!navigator.onLine) return;
  
  const queue = await getSyncQueue();
  if (queue.length === 0) return;
  
  const failed = [];
  
  for (const item of queue) {
    try {
      let result;
      
      switch (item.action) {
        case 'createSubmission':
          result = await createSubmission(item.data.userId, item.data.submission);
          break;
        case 'rateSubmission':
          result = await rateSubmission(item.data.submissionId, item.data.raterId, item.data.rating, item.data.comment);
          break;
        case 'engage':
          result = await engageWithSubmission(item.data.userId, item.data.submissionId, item.data.action);
          break;
      }
      
      if (!result.success) {
        item.retries++;
        if (item.retries < 3) {
          failed.push(item);
        }
      }
    } catch (err) {
      item.retries++;
      if (item.retries < 3) {
        failed.push(item);
      }
    }
  }
  
  await saveSyncQueue(failed);
}

// Listen for online/offline events
window.addEventListener('online', syncOfflineActions);

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// SEARCH
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function searchSubmissions(query, filters = {}) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    // Use text search if available
    const { data, error } = await autoeduSupabase
      .from('autoedu_submissions')
      .select(`
        *,
        autoedu_profiles!inner(display_name)
      `)
      .textSearch('search_vector', query)
      .eq('status', 'approved')
      .limit(filters.limit || 20);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    // Fallback: basic ILIKE search
    try {
      const { data } = await autoeduSupabase
        .from('autoedu_submissions')
        .select(`
          *,
          autoedu_profiles!inner(display_name)
        `)
        .or(`title.ilike.%${query}%,abstract.ilike.%${query}%`)
        .eq('status', 'approved')
        .limit(filters.limit || 20);
      
      return data || [];
    } catch (fallbackErr) {
      console.error('AutoEdu: Search error:', fallbackErr);
      return [];
    }
  }
}

// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻
// LEADERBOARD
// ⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻⸻

async function getLeaderboard(domain = null, limit = 100) {
  if (!autoeduSupabase) initAutoEduSupabase();
  
  try {
    let query = autoeduSupabase
      .from('autoedu_profiles')
      .select('user_id, display_name, neoscore, credibility, total_works, primary_domain')
      .gt('total_works', 0)
      .order('neoscore', { ascending: false })
      .limit(limit);
    
    if (domain) {
      query = query.eq('primary_domain', domain);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('AutoEdu: Error fetching leaderboard:', err);
    return [];
  }
}

// Export functions for use in app.js
window.AutoEduSupabase = {
  init: initAutoEduSupabase,
  
  // Profiles
  getProfile: getAutoEduProfile,
  createProfile: createAutoEduProfile,
  updateProfile: updateAutoEduProfile,
  
  // Submissions
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmission,
  deleteSubmission,
  
  // Ratings
  rateSubmission,
  
  // Engagements
  engageWithSubmission,
  
  // Arbiters
  reviewSubmission,
  getPendingSubmissions,
  
  // Stats
  getMonthlyStats,
  checkMonthlyCap,
  
  // Galleries
  getGalleryWorks,
  
  // Feed
  getStructuredFeed,
  
  // Files
  uploadFile,
  deleteFile,
  
  // Real-time
  subscribeToSubmission,
  subscribeToFeed,
  subscribeToUserSubmissions,
  unsubscribeAll,
  
  // Search
  searchSubmissions,
  
  // Leaderboard
  getLeaderboard,
  
  // Offline
  queueOfflineAction,
  syncOfflineActions,
  
  // Get client
  getClient: () => autoeduSupabase
};
