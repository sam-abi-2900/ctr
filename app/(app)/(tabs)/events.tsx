import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable, SafeAreaView, Modal, TextInput, Alert, RefreshControl } from 'react-native';
import { ChevronDown, ChevronLeft, Calendar, Eye, Check, X } from 'lucide-react-native';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isToday, parseISO } from 'date-fns';
import React from 'react';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, borderRadius, shadows } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { StandbyTimer } from '@/components/StandbyTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type EventStatus = 'assigned' | 'accepted' | 'rejected';
type EventStage = 'not_started' | 'warehouse_checkin' | 'warehouse_checkout' | 'truck_checkin' | 'truck_checkout' | 'event_checkin' | 'event_checkout' | 'completed';
type RoutePath = '/check-in' | '/warehouse-check-in' | '/warehouse-checkout' | '/warehouse-tasks' | '/truck-check-in-out' | '/event-check-in' | '/event-check-out' | '/tasks' | '/verification' | '/completion' | '/override-check-in' | '/event-details';
type EventType = 'warehouse' | 'event' | 'warehouse-event';

interface CheckInStatus {
  checked_in: boolean;
  checked_out: boolean;
  checkin_time: string | null;
  checkout_time: string | null;
}

interface EventCheckInStatus {
  warehouse: CheckInStatus;
  truck: CheckInStatus;
  event: CheckInStatus;
}

interface Task {
  id: string;
  name: string;
  type: string;
  description: string;
  task_status: string | null;
  image_url: string | null;
  rejection_reason: string | null;
}

interface Event {
  id: string;
  assignment_id: string;
  title: string;
  type: EventType;
  city: string;
  event_datetime: string;
  image_url: string;
  latitude: string;
  longitude: string;
  warehouse_lat: string;
  warehouse_lng: string;
  event_lat: string;
  event_lng: string;
  status: EventStatus;
  checkin_status: EventCheckInStatus;
  tasks: Task[];
}

interface EventsResponse {
  assigned: Event[];
  accepted: Event[];
  rejected: Event[];
}

const EVENT_STAGES: EventStage[] = [
  'not_started',
  'warehouse_checkin',
  'warehouse_checkout',
  'truck_checkin',
  'truck_checkout',
  'event_checkin',
  'event_checkout',
  'completed'
];

export default function EventsScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedStatus, setSelectedStatus] = useState<EventStatus>('assigned');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showOvertimeModal, setShowOvertimeModal] = useState(false);
  const [warehouseTimer, setWarehouseTimer] = useState(0);
  const [isWarehouseActive, setIsWarehouseActive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState<EventsResponse>({ assigned: [], accepted: [], rejected: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchEvents = useCallback(async () => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      console.log('Fetching events for date:', formattedDate);
      const response = await fetch(
        `http://localhost:3000/api/vendor/events?vendor_id=1f30b1a0-d4c3-4d36-8f3d-263e6b1b00cd&date=${formattedDate}`
      );
      const data: EventsResponse = await response.json();
      console.log('API Response:', data);

      // Load persisted stages for each event
      const eventsWithPersistedStages = await Promise.all(
        Object.values(data).flat().map(async (event) => {
          const persistedStage = await AsyncStorage.getItem(`event_stage_${event.id}`);
          if (persistedStage) {
            return { ...event, current_stage: persistedStage as EventStage };
          }
          return event;
        })
      );

      // Reconstruct the response with updated stages
      const updatedData = {
        assigned: eventsWithPersistedStages.filter(e => e.status === 'assigned'),
        accepted: eventsWithPersistedStages.filter(e => e.status === 'accepted'),
        rejected: eventsWithPersistedStages.filter(e => e.status === 'rejected')
      };

      console.log('Processed events data:', updatedData);
      setEvents(updatedData);
    } catch (error) {
      console.error('Error fetching events:', error);
      Alert.alert('Error', 'Failed to fetch events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDate]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, [fetchEvents]);

  const getCurrentStage = (event: Event): EventStage => {
    const { type, checkin_status } = event;
    const { warehouse, truck, event: eventCheckin } = checkin_status;
    console.log('getCurrentStage - Event type:', type);
    console.log('getCurrentStage - Check-in status:', checkin_status);

    let stage: EventStage;
    switch (type) {
      case 'warehouse':
        if (!warehouse.checkin_time) {
          stage = 'warehouse_checkin';
        } else if (!warehouse.checkout_time) {
          stage = 'warehouse_checkout';
        } else {
          stage = 'completed';
        }
        console.log('getCurrentStage - Warehouse event stage:', stage);
        return stage;

      case 'warehouse-event':
        if (!warehouse.checkin_time) {
          stage = 'warehouse_checkin';
        } else if (!warehouse.checkout_time) {
          stage = 'warehouse_checkout';
        } else if (!truck.checkin_time) {
          stage = 'truck_checkin';
        } else if (!truck.checkout_time) {
          stage = 'truck_checkout';
        } else if (!eventCheckin.checkin_time) {
          stage = 'event_checkin';
        } else if (!eventCheckin.checkout_time) {
          stage = 'event_checkout';
        } else {
          stage = 'completed';
        }
        console.log('getCurrentStage - Warehouse-event stage:', stage);
        return stage;

      case 'event':
        if (!eventCheckin.checkin_time) {
          stage = 'event_checkin';
        } else if (!eventCheckin.checkout_time) {
          stage = 'event_checkout';
        } else {
          stage = 'completed';
        }
        console.log('getCurrentStage - Event stage:', stage);
        return stage;

      default:
        console.log('getCurrentStage - Default stage: not_started');
        return 'not_started';
    }
  };

  const getNextStage = (event: Event): EventStage | null => {
    const currentStage = getCurrentStage(event);
    const { type } = event;
    console.log('getNextStage - Event type:', type);
    console.log('getNextStage - Current stage:', currentStage);

    let nextStage: EventStage | null = null;
    switch (type) {
      case 'warehouse':
        switch (currentStage) {
          case 'warehouse_checkin':
            nextStage = 'warehouse_checkout';
            break;
          case 'warehouse_checkout':
            nextStage = 'completed';
            break;
          default:
            nextStage = null;
        }
        console.log('getNextStage - Warehouse next stage:', nextStage);
        return nextStage;

      case 'warehouse-event':
        switch (currentStage) {
          case 'warehouse_checkin':
            nextStage = 'warehouse_checkout';
            break;
          case 'warehouse_checkout':
            nextStage = 'truck_checkin';
            break;
          case 'truck_checkin':
            nextStage = 'truck_checkout';
            break;
          case 'truck_checkout':
            nextStage = 'event_checkin';
            break;
          case 'event_checkin':
            nextStage = 'event_checkout';
            break;
          case 'event_checkout':
            nextStage = 'completed';
            break;
          default:
            nextStage = null;
        }
        console.log('getNextStage - Warehouse-event next stage:', nextStage);
        return nextStage;

      case 'event':
        switch (currentStage) {
          case 'event_checkin':
            nextStage = 'event_checkout';
            break;
          case 'event_checkout':
            nextStage = 'completed';
            break;
          default:
            nextStage = null;
        }
        console.log('getNextStage - Event next stage:', nextStage);
        return nextStage;

      default:
        console.log('getNextStage - Default next stage: null');
        return null;
    }
  };

  const handleCheckIn = (event: Event) => {
    const currentStage = getCurrentStage(event);
    const nextStage = getNextStage(event);
    console.log('Event type:', event.type);
    console.log('Current stage:', currentStage);
    console.log('Next stage:', nextStage);
    console.log('Check-in status:', event.checkin_status);

    if (!nextStage) {
      console.log('Event completed, returning to home');
      router.push('/');
      return;
    }

    // Determine which screen to navigate to based on the current stage and event type
    let route: RoutePath = '/check-in';
    let params: any = {
      eventId: event.id,
      assignmentId: event.assignment_id,
      title: event.title,
      date: event.event_datetime,
      location: event.city,
      currentStage: currentStage,
      nextStage: nextStage,
      eventType: event.type,
      latitude: event.latitude,
      longitude: event.longitude,
      imageUrl: event.image_url,
      checkinStatus: JSON.stringify(event.checkin_status),
      warehouse_lat: event.warehouse_lat,
      warehouse_lng: event.warehouse_lng,
      event_lat: event.event_lat,
      event_lng: event.event_lng
    };

    // Use currentStage for routing decisions
    switch (currentStage) {
      case 'warehouse_checkin':
        console.log('Routing to warehouse check-in');
        route = '/warehouse-check-in';
        break;
      case 'warehouse_checkout':
        console.log('Routing to warehouse checkout');
        route = '/warehouse-checkout';
        break;
      case 'truck_checkin':
        if (event.type === 'warehouse-event') {
          console.log('Routing to truck check-in-out');
          route = '/truck-check-in-out';
        } else {
          console.log('Invalid stage for event type, returning to home');
          router.push('/');
          return;
        }
        break;
      case 'truck_checkout':
        if (event.type === 'warehouse-event') {
          console.log('Routing to truck check-in-out');
          route = '/truck-check-in-out';
        } else {
          console.log('Invalid stage for event type, returning to home');
          router.push('/');
          return;
        }
        break;
      case 'event_checkin':
        console.log('Routing to event check-in');
        route = '/check-in';
        break;
      case 'event_checkout':
        console.log('Routing to event check-out');
        route = '/completion';
        break;
      default:
        // For any other stage, we'll show tasks
        if (event.type === 'warehouse') {
          console.log('Routing to warehouse tasks');
          route = '/warehouse-tasks';
        } else if (event.type === 'warehouse-event') {
          console.log('Routing to tasks');
          route = '/tasks';
        } else {
          console.log('Routing to tasks');
          route = '/tasks';
        }
    }

    console.log('Route:', route);
    console.log('Params:', params);
    //@ts-ignore
    router.push({ pathname: route, params });
  };

  const handleReject = (eventId: string) => {
    setSelectedEventId(eventId);
    setShowRejectionModal(true);
  };

  const updateEventStatus = async (assignmentId: string, action: 'accepted' | 'rejected', rejectionReason?: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/vendor/events/assignment', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignment_id: assignmentId,
          action,
          ...(action === 'rejected' && rejectionReason ? { rejection_reason: rejectionReason } : {})
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event status');
      }

      await fetchEvents();

      Alert.alert('Success', `Event ${action} successfully`);
    } catch (error) {
      console.error('Error updating event status:', error);
      Alert.alert('Error', 'Failed to update event status');
    }
  };

  const handleRejectionSubmit = async () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }

    if (!selectedEventId) return;

    const event = [...events.assigned, ...events.accepted, ...events.rejected]
      .find(e => e.id === selectedEventId);

    if (!event) {
      Alert.alert('Error', 'Event not found');
      return;
    }

    await updateEventStatus(event.assignment_id, 'rejected', rejectionReason);

    setShowRejectionModal(false);
    setRejectionReason('');
    setSelectedEventId(null);
  };

  const RejectionModal = () => (
    <Modal
      visible={showRejectionModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowRejectionModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Reject Event</Text>
          <Text style={styles.modalSubtitle}>Please provide a reason for rejecting this event</Text>

          <TextInput
            style={styles.reasonInput}
            placeholder="Enter your reason here..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            numberOfLines={4}
            value={rejectionReason}
            onChangeText={setRejectionReason}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setShowRejectionModal(false);
                setRejectionReason('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={handleRejectionSubmit}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const OvertimeModal = () => (
    <Modal
      visible={showOvertimeModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowOvertimeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Overtime Detected</Text>
          <Text style={styles.modalSubtitle}>You have exceeded the standard warehouse time. Please request approval to continue.</Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowOvertimeModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={() => {
                setShowOvertimeModal(false);
                Alert.alert('Success', 'Overtime approval requested');
              }}
            >
              <Text style={styles.submitButtonText}>Request Approval</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWarehouseActive) {
      timer = setInterval(() => {
        setWarehouseTimer(prev => {
          const newTime = prev + 1;
          if (newTime === 10) {
            setShowOvertimeModal(true);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isWarehouseActive]);

  useEffect(() => {
    if (!isWarehouseActive) {
      setWarehouseTimer(0);
    }
  }, [isWarehouseActive]);

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'assigned':
        return colors.secondary;
      case 'accepted':
        return colors.success;
      case 'rejected':
        return colors.danger;
      default:
        return colors.secondary;
    }
  };

  const EventCard = ({ event }: { event: Event }) => {
    const getStageDisplay = (stage: EventStage) => {
      switch (stage) {
        case 'not_started': return 'Not Started';
        case 'warehouse_checkin': return 'Warehouse Check-in';
        case 'warehouse_checkout': return 'Warehouse Check-out';
        case 'truck_checkin': return 'Truck Check-in';
        case 'truck_checkout': return 'Truck Check-out';
        case 'event_checkin': return 'Event Check-in';
        case 'event_checkout': return 'Event Check-out';
        case 'completed': return 'Completed';
        default: return stage;
      }
    };

    const currentStage = getCurrentStage(event);

    const handleViewDetails = () => {
      router.push({
        pathname: '/event-details',
        params: {
          eventId: event.id,
          assignmentId: event.assignment_id,
          title: event.title,
          type: event.type,
          city: event.city,
          eventDatetime: event.event_datetime,
          imageUrl: event.image_url,
          latitude: event.latitude,
          longitude: event.longitude,
          currentStage: currentStage,
          tasks: JSON.stringify(event.tasks),
          checkinStatus: JSON.stringify(event.checkin_status)
        }
      });
    };

    return (
      <TouchableOpacity
        onPress={() => setExpandedCard(expandedCard === event.id ? null : event.id)}
      >
        <View
          style={[
            styles.eventCard,
            expandedCard === event.id ? styles.focusedCard : styles.normalCard
          ]}
        >
          <Image source={{ uri: event.image_url }} style={styles.eventImage} />
          <View style={styles.eventContent}>
            <Text style={styles.eventDate}>
              {format(parseISO(event.event_datetime), 'd MMM')}
            </Text>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventOrganizer}>{event.type}</Text>

            <View style={styles.eventFooter}>
              <Text style={styles.stageText}>
                Stage: {getStageDisplay(currentStage)}
              </Text>
            </View>

            {expandedCard === event.id && (
              <View style={styles.expandedActions}>
                {event.status === 'assigned' ? (
                  <>
                    <TouchableOpacity
                      style={styles.actionButton}
                      activeOpacity={0.7}
                      onPress={() => updateEventStatus(event.assignment_id, 'accepted')}
                    >
                      <View style={[styles.actionIcon, { backgroundColor: colors.success }]}>
                        <Check size={16} color="#fff" />
                      </View>
                      <Text style={styles.actionButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      activeOpacity={0.7}
                      onPress={() => handleReject(event.id)}
                    >
                      <View style={[styles.actionIcon, { backgroundColor: colors.danger }]}>
                        <X size={16} color="#fff" />
                      </View>
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      activeOpacity={0.7}
                      onPress={handleViewDetails}
                    >
                      <View style={[styles.actionIcon, { backgroundColor: colors.primary }]}>
                        <Eye size={16} color="#fff" />
                      </View>
                      <Text style={styles.actionButtonText}>View</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCheckIn(event)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: 'green' }]}>
                      <Eye size={16} color="#fff" />
                    </View>
                    <Text style={styles.actionButtonText}>Continue</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={[styles.statusTag, { backgroundColor: getStatusColor(event.status) }]}>
              <Text style={styles.statusText}>{event.status.toLowerCase()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredEvents = events[selectedStatus] || [];
  console.log('Selected status:', selectedStatus);
  console.log('Filtered events:', filteredEvents);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Events</Text>
      </View>

      {isToday(selectedDate) && (
        <View style={styles.dateHeader}>
          <View style={styles.dateHeaderContent}>
            <View style={styles.dateHeaderLeft}>
              <View style={styles.dateHeaderBadge}>
                <Text style={styles.dateHeaderText}>Today</Text>
                <View style={styles.dateHeaderBadgeContent}>
                  <Calendar size={16} color={colors.secondary} style={styles.calendarIcon} />
                  <Text style={styles.dateHeaderBadgeText}>
                    {format(selectedDate, 'EEEE, MMM d')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      <View style={styles.calendar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.calendarScrollContent}
        >
          {eachDayOfInterval({
            start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
            end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
          }).map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateCard,
                format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && styles.selectedDate,
                isToday(day) && !format(day, 'yyyy-MM-dd').includes(format(selectedDate, 'yyyy-MM-dd')) && styles.todayCard,
              ]}
              onPress={() => setSelectedDate(day)}
              activeOpacity={0.8}
            >
              <View style={styles.dateCardContent}>
                <Text style={[
                  styles.dateNumber,
                  format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && styles.selectedDateText,
                  isToday(day) && !format(day, 'yyyy-MM-dd').includes(format(selectedDate, 'yyyy-MM-dd')) && styles.todayDateText,
                ]}>
                  {format(day, 'd')}
                </Text>
                <Text style={[
                  styles.dateDay,
                  format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') && styles.selectedDateText,
                  isToday(day) && !format(day, 'yyyy-MM-dd').includes(format(selectedDate, 'yyyy-MM-dd')) && styles.todayDateText,
                ]}>
                  {format(day, 'EEE')}
                </Text>
                {isToday(day) && !format(day, 'yyyy-MM-dd').includes(format(selectedDate, 'yyyy-MM-dd')) && (
                  <View style={styles.todayIndicator} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.statusTabs}>
        <TouchableOpacity
          style={[styles.statusTab, selectedStatus === 'assigned' && styles.selectedStatusTab]}
          onPress={() => setSelectedStatus('assigned')}
        >
          <Text style={[styles.statusTabText, selectedStatus === 'assigned' && styles.selectedStatusText]}>
            ASSIGNED ({events.assigned.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusTab, selectedStatus === 'accepted' && styles.selectedStatusTab]}
          onPress={() => setSelectedStatus('accepted')}
        >
          <Text style={[styles.statusTabText, selectedStatus === 'accepted' && styles.selectedStatusText]}>
            ACCEPTED ({events.accepted.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statusTab, selectedStatus === 'rejected' && styles.selectedStatusTab]}
          onPress={() => setSelectedStatus('rejected')}
        >
          <Text style={[styles.statusTabText, selectedStatus === 'rejected' && styles.selectedStatusText]}>
            REJECTED ({events.rejected.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        ) : filteredEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {selectedStatus} events found</Text>
          </View>
        ) : (
          filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </ScrollView>
      <StandbyTimer />
      <RejectionModal />
      <OvertimeModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingTop: spacing.xs,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    marginRight: spacing.md,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title1,
    color: colors.text.primary,
  },
  calendar: {
    paddingVertical: spacing.xs,
    backgroundColor: colors.background.primary,
  },
  calendarScrollContent: {
    paddingHorizontal: spacing.md,
  },
  dateCard: {
    width: 60,
    height: 70,
    marginHorizontal: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.background.new,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  dateCardContent: {
    alignItems: 'center',
    position: 'relative',
  },
  selectedDate: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.05 }],
  },
  todayCard: {
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  dateNumber: {
    ...typography.title3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  dateDay: {
    ...typography.caption1,
    color: colors.text.tertiary,
  },
  selectedDateText: {
    color: colors.background.primary,
  },
  todayDateText: {
    color: colors.primary,
  },
  todayIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.new,
  },
  statusTabs: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  selectedStatusTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary,
  },
  statusTabText: {
    ...typography.footnote,
    fontWeight: '600',
    color: colors.text.tertiary,
  },
  selectedStatusText: {
    color: colors.secondary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  eventCard: {
    backgroundColor: colors.background.new,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.medium,
  },
  normalCard: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  focusedCard: {
    borderWidth: 1.5,
    borderColor: colors.secondary,
    transform: [{ scale: 1.01 }],
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  eventContent: {
    padding: spacing.md,
  },
  eventDate: {
    ...typography.footnote,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  eventTitle: {
    ...typography.title3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  eventOrganizer: {
    ...typography.subhead,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expandedActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    ...shadows.small,
  },
  actionButtonText: {
    ...typography.caption1,
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  statusTag: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    ...typography.caption2,
    fontWeight: '600',
    color: colors.background.primary,
    textTransform: 'capitalize',
  },
  dateHeader: {
    padding: spacing.md,
    paddingTop: 0,
    backgroundColor: colors.background.primary,
  },
  dateHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dateHeaderLeft: {
    flex: 1,
  },
  dateHeaderBadge: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.background.new,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    ...shadows.small,
    width: '100%',
  },
  dateHeaderText: {
    ...typography.title3,
    color: colors.secondary,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  dateHeaderBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: spacing.xs,
  },
  dateHeaderBadgeText: {
    ...typography.footnote,
    color: colors.secondary,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 400,
    ...shadows.medium,
  },
  modalTitle: {
    ...typography.title2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  reasonInput: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...typography.body,
    color: colors.text.primary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  modalButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  cancelButton: {
    backgroundColor: colors.background.tertiary,
  },
  submitButton: {
    backgroundColor: colors.danger,
  },
  cancelButtonText: {
    ...typography.body,
    color: colors.text.primary,
  },
  submitButtonText: {
    ...typography.body,
    color: colors.background.primary,
  },
  stageText: {
    ...typography.footnote,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.text.secondary,
  },
});